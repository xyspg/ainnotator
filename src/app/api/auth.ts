import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";

export async function checkAuth(req: Request) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data: userData, error } = await supabase.auth.getUser();

  const user = userData.user;

  if (!user) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
    });
  }
}
