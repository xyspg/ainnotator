import { createClient } from "@/lib/supabase/server";
import { log } from "console";
import { LucideLogIn } from "lucide-react";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  const { message } = await request.json();
  const supabase = createClient(cookies());
  const {
    data: { user },

  } = await supabase.auth.getUser();
  console.log(user);
  return new Response(JSON.stringify(user), { status: 200 });
}
