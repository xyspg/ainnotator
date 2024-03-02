import {createClient} from "@supabase/supabase-js";

export async function GET(request: Request) {
  const queryParams = new URLSearchParams(request.url.split("?")[1]);
  const orderId = queryParams.get("out_trade_no")
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
  const orderData = await supabase.from('orders').select("*").eq("order_id", orderId)

  if (orderData.error) {
    return new Response(JSON.stringify({ message: orderData.error }), {
      status: 500,
    });
  }
  const userId = orderData.data[0].user_id
  const product = orderData.data[0].product
  const amount = product.amount

  const { error: TransactionError } = await supabase
    .from("transactions")
    .insert({
      user_id: userId,
      email: orderData.data[0].email ,
      type: "add",
      category: "Top Up",
      amount,
    });
  const { data: creditData, error: getCreditError } = await supabase
    .from("users")
    .select("ainnotation_credit")
    .eq("id", userId);

  const { error: UpdateCreditError } = await supabase
    .from("users")
    .update({
      ainnotation_credit: creditData?.[0].ainnotation_credit + amount,
    })
    .eq("id", userId)

  /**
   * Update Order
   */
  const { error: UpdateOrderError } = await supabase
    .from("orders")
    .update({ status: "paid", payment_method: "easypay", real_payment_amount: queryParams.get('money') })
    .eq("order_id", orderId)


  return new Response(JSON.stringify("ok"), { status: 200 });
}