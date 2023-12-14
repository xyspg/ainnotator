import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

export async function POST(){
    const cookieStore = cookies();
    const supabase = createClient(cookieStore)
    const { data, error } = await supabase
        .from('users')
        .select('ainnotation_credit')

}

export async function GET(request: Request){
    const { searchParams } = new URL(request.url)
    if (!searchParams.has('refererCode')) {
        return new Response(JSON.stringify({ message: 'No referer code given' }), {
            status: 400
        })
    }
    const cookieStore = cookies();
    const supabase = createClient(cookieStore)
    const refererCode = searchParams.get('refererCode')
    const { data, error } = await supabase
        .from('users')
        .select('id, referer_code')
        .eq('referer_code', refererCode)
        .single()
    if (!data) {
        return new Response("Referer Code Not Found", {
            status: 404
        })
    }
    if (error) {
        //@ts-expect-error
        return new Response(error.message, {
            status: 500
        })
    }

    return new Response(JSON.stringify(data.id), {
        status: 200
    })

}