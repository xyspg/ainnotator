import { createClient } from "@/lib/supabase/server";
import { cookies } from 'next/headers'
export async function POST(req: Request) {
   const supabase = createClient(cookies());
    const { data: { user }, error } = await supabase.auth.getUser();
    if (!user) {
        return new Response(JSON.stringify({ message: "Unauthorized" }), {
            status: 401,
        });
    }
    const { setting, prompt } = await req.json();
    if (setting === 'custom_prompt') {
        const { data, error } = await supabase
            .from('users')
            .update({ custom_prompt: prompt })
            .eq('id', user.id)
        if (error) {
            return new Response(error.message, { status: 500 });
        }
        return new Response(JSON.stringify('ok'), { status: 200 });
    }
}