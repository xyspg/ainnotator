/**
 * Update user metadata
 * make sure they have a referer code
 */
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { randomNanoID } from "@/lib/utils";
//TODO: use service role key to add metadata to everyone

export async function POST(request: Request) {
   const supabase = createClient(cookies())
    const { data: {user} } = await supabase.auth.getUser();
    if (!user) {
        return new Response(JSON.stringify({ message: "Unauthorized" }), {
            status: 401,
        });
    }
    const metadata = user.user_metadata
    console.log(metadata);
    if (metadata.referer_code) {
        return new Response(null, { status: 204} )
    }
    const {  error} = await supabase.auth.updateUser({
        data: { referer_code: randomNanoID()  },
    });

    if (error) {
        return new Response(error.message)
    }

    return new Response('ok', { status: 201 })
}