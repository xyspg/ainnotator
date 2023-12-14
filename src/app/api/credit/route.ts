/*
 * GET /api/credit
 * Return the user credit
 * Authorization: Cookie
 * Return 401 if not logged in
 */

import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

export async function GET(req: Request) {
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

  const { data: credit, error } = await supabase
    .from("users")
    .select("ainnotation_credit", { count: "exact" })
    .eq("id", user?.id);

  const count = credit?.[0].ainnotation_credit;

  if (error) {
    return new Response(error.message, { status: 500 });
  }

  return new Response(JSON.stringify({ count }), {
    status: 200,
  });
}
