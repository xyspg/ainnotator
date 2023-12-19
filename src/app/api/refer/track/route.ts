/**
 * OAuth like Login with Google will not include user metadata
 * Manually update user metadata for those users
 * First check if they have already been invited
 */

import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { isDev } from "@/lib/utils";

export async function POST(request: Request) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
    });
  }

  const { data: refer, error } = await supabase
    .from("users")
    .select("referred_by")
    .eq("id", user.id)
    .single();

  if (error) {
    console.error(error.message);
    return new Response(error.message, { status: 500 });
  }
  console.log(refer.referred_by);

  /**
   * If already referred
   */
  if (refer.referred_by) {
    return new Response(JSON.stringify({ message: "Already invited" }), {
      status: 403,
    });
  }

  const body = await request.json();
  const { referer } = body;

  if (!referer) {
    return new Response(JSON.stringify({ message: "No referer code given" }), {
      status: 400,
    });
  }

  const { data, error: UpdateError } = await supabase.auth.updateUser({
    data: { referred_by: referer },
  });
  console.log(data);
  const { error: UpdateRefererError } = await supabase
    .from("users")
    .update({
      referred_by: referer,
    })
    .eq("id", user.id);

  if (UpdateError) {
    console.error(UpdateError?.message);
    return new Response(UpdateError?.message, { status: 500 });
  }
  if (UpdateRefererError) {
    console.error(UpdateRefererError?.message);
    return new Response(UpdateRefererError?.message, { status: 500 });
  }

    /**
     * Trigger the webhook route
     */
  await fetch(
    isDev()
      ? `http://localhost:3000/api/refer`
      : `https://ainnotator.com/api/refer`,
    {
      method: "POST",
      headers: {
        "x-credential": "0d00Onani",
      },
    },
  );

  return new Response(JSON.stringify({ message: "ok" }), {
    status: 200,
  });
}
