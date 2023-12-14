import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
export async function POST(request: Request) {
    const cookieStore = cookies()

    const supabase = createClient(cookieStore);
    const { email, userId, product, orderId } = await request.json();
    const { data, error } = await supabase.from("orders").insert({
        user_id: userId,
        email,
        product,
        order_id: orderId
    });
    if (error) {
        return new Response(JSON.stringify({ message: error }), {
            status: 500,
        });
    }
    return new Response(JSON.stringify({ message: "Success" }), {
        status: 200,
    });
}