import createMiddleware from 'next-intl/middleware';
import createIntlMiddleware from 'next-intl/middleware';
import type {NextRequest} from "next/server";
import { createClient } from "@/lib/supabase/middleware";


export default async function middleware(request: NextRequest) {
    // Step 1: Use the incoming request (example)
    const defaultLocale = request.headers.get('x-default-locale') || 'en';

    // Step 2: Create and call the next-intl middleware (example)
    const handleI18nRouting = createIntlMiddleware({
        locales: ['en', 'zh-CN'],

        defaultLocale: 'en',
        localePrefix: 'never'
    });

    const { supabase } = createClient(request);

    await supabase.auth.getSession();

    const response = handleI18nRouting(request);

    response.headers.set('x-default-locale', defaultLocale);

    return response;
}

export const config = {
    // Match only internationalized pathnames
    matcher: [
        '/',
        // Match all pathnames except for
        // - … if they start with `/api`, `/_next` or `/_vercel`
        // - … the ones containing a dot (e.g. `favicon.ico`)
        '/((?!api|_next|_vercel|.*\\..*).*)',
        // Match all pathnames within `/users`, optionally with a locale prefix
        '/(.+)?/users/(.+)'
    ]
};