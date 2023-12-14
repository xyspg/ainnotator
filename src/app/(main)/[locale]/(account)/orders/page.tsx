import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

export default async function Page() {
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)
    const { data: { user }} = await supabase.auth.getUser();
    const { data: orders, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
    const mapping = {
        'pending': '等待支付',
        'paid': '已支付',
    }
    return (
        <>
            <div className="p-8 flex flex-col gap-4">
                {orders?.map((order) => (
                <div key={order.id}>
                    <p>{order.order_id}</p>
                    <p>{order.amount}</p>
                    <p>{new Date(order.created_at).toLocaleString('zh-CN')}</p>
                    <p>{mapping[order.status]}</p>
                </div>
            ))}
            </div>
        </>
    )
}