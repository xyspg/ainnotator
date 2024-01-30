// import { createClient } from "@/lib/supabase/server";
// import { cookies } from "next/headers";
// import { PRODUCTS } from "@/lib/constant";
// import { isDev } from "@/lib/utils";
// import { lemon } from "@/lib/lemon";
//
// /**
//  * 付款后的回调接口
//  * @param request
//  * @constructor
//  */
// export async function GET(request: Request) {
//   /**
//    * Auth Check
//    */
//   const cookieStore = cookies();
//   const supabase = createClient(cookieStore);
//   const {
//     data: { user },
//   } = await supabase.auth.getUser();
//   if (!user) {
//     return new Response(JSON.stringify({ message: "Unauthorized" }), {
//       status: 401,
//     });
//   }
//   const { searchParams } = new URL(request.url);
//   const orderId = searchParams.get("order_id");
//   if (!orderId) {
//     return new Response(JSON.stringify({ message: "No order id given" }), {
//       status: 400,
//     });
//   }
//   const { data: orderData, error: orderError } = await supabase
//     .from("webhook_aifadian")
//     .select("*")
//     .eq("data->order->>custom_order_id", orderId)
//     .single();
//
//   console.log(orderData, orderError);
//
//     if (!orderData) {
//         return new Response(
//             JSON.stringify({ code: 404, message: "Your order could not be found." }),
//             {
//                 status: 404,
//             },
//         );
//     }
//     const product = PRODUCTS.find(
//     (item) => item.plan_id === orderData.data.order.plan_id,
//   );
//
//   const amount = product ? product.amount : 0;
//     // update order with merchant response
//
//   const { data: clientOrderData, error: UpdateError } = await supabase
//     .from("orders")
//     .update({
//       status: "completed",
//       merchant: orderData,
//       payment_method: "aifadian",
//       real_payment_amount: orderData.data.order.total_amount,
//     })
//     .eq("order_id", orderId);
//
//   const { error: TransactionError } = await supabase
//     .from("transactions")
//     .insert({
//       user_id: user.id,
//       email: user.email,
//       type: "add",
//       category: "Top Up",
//       amount,
//     });
//
//   const { data: creditData, error: getCreditError } = await supabase
//     .from("users")
//     .select("ainnotation_credit")
//     .eq("id", user.id);
//   // [ { ainnotation_credit: 35 } ]
//   console.log(creditData);
//
//   const { error: UpdateCreditError } = await supabase
//     .from("users")
//     .update({
//       ainnotation_credit: creditData?.[0].ainnotation_credit + amount,
//     })
//     .eq("id", user.id);
//
//   if (UpdateError || TransactionError || getCreditError || UpdateCreditError) {
//     console.error(
//       UpdateError,
//       TransactionError,
//       getCreditError,
//       UpdateCreditError,
//     );
//
//     return new Response(
//       JSON.stringify({ message: "There is an error processing your order." }),
//       {
//         status: 404,
//       },
//     );
//   }
//   return new Response(JSON.stringify({ code: 200, message: "success" }), {
//     status: 200,
//   });
// }
