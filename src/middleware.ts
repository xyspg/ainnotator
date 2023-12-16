import createMiddleware from "next-intl/middleware";
import createIntlMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/middleware";
import { redirect } from "next/navigation";

export default async function middleware(request: NextRequest) {
  // Step 1: Use the incoming request (example)
  const defaultLocale = request.headers.get("x-default-locale") || "en";
  const { supabase } = createClient(request);

  const { data: { user } } = await supabase.auth.getUser();
  const protectedPaths = ['/orders','/referral','/settings','/history']
  if (protectedPaths.includes(request.nextUrl.pathname) && !user) {
    return Response.redirect(new URL(`/signup?redirect=${encodeURIComponent(request.nextUrl.pathname)}`, request.url));
  }

  const handleI18nRouting = createIntlMiddleware({
    locales: ["en", "zh-CN"],
    defaultLocale: "en",
    localePrefix: "never",
  });


  const response = handleI18nRouting(request);
  response.headers.set(
    "x-default-locale",
    request.headers.get("x-default-locale") || "en",
  );

  return response;
}

/**
 * Auth failed
 * @param {NextRequest} req
 * @return {*}  {Response}
 */
function redirectAuth(): Response {
  // return NextResponse.redirect(new URL("/shop", req.url));
  console.error("Authentication Failed");
  return new Response(
    JSON.stringify({ success: false, message: "Authentication Failed" }),
    {
      status: 401,
    },
  );
}

/**
 * Redirects the user to the page where the number of uses is purchased
 *
 * @param {NextRequest} req
 * @return {*}  {NextResponse}
 */
function redirectShop(req: NextRequest): Response {
  console.error("Account Limited");
  return Response.redirect(new URL("/pricing", req.url));
}

export const config = {
  // Match only internationalized pathnames
  matcher: [
    "/",
    // Match all pathnames except for
    // - … if they start with `/api`, `/_next` or `/_vercel`
    // - … the ones containing a dot (e.g. `favicon.ico`)
    "/((?!api|monitoring|_next|_vercel|.*\\..*).*)",
    // '/((?!api|_next|_vercel|.*\\..*).*)',
    // Match all pathnames within `/users`, optionally with a locale prefix
    "/(.+)?/users/(.+)",
  ],
};
