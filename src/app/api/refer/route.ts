import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

export async function POST(){
    const cookieStore = cookies();
    const supabase = createClient(cookieStore)
    const { data, error } = await supabase
        .from('users')
        .select('ainnotation_credit')

}