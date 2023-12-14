import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { equal } from "node:assert";

export async function POST(request: Request) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  /*
    * Get Referer Code
    const { data:  referer_code  , error:  findRefererError } = await supabase
        .from("users")
        .select("referer_code")
        .eq('id', user?.id)
        .single()
    
    const refererCode = referer_code?.referer_code

     */

  /*
   * Query referee 被邀请者
   */
  const { data, error } = await supabase
    .from("referrals")
    .select("referee_id")
    .eq("referer_id", user?.id);

  const refereeIds = data?.map((item) => item.referee_id);
  console.log(refereeIds);

  /*
   * Query Referee Orders 查询被邀请者的订单
   */
  const { data: refereeOrders, error: refereeOrdersError } = await supabase
    .from("orders")
    .select(
      "order_id, created_at, email, status, real_payment_amount, product -> name",
    )
    .in("user_id", refereeIds!);

  console.log(refereeOrders);

  return new Response(JSON.stringify(refereeOrders), {
    status: 200,
  });
}
