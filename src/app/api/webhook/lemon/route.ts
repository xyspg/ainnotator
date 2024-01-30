/**
 * Callback for lemon squeezy
 */
import { createClient } from "@supabase/supabase-js";
import * as crypto from "crypto";
import { isDev } from "@/lib/utils";

export async function POST(request: Request) {
  const rawBody = await request.text();
  const body = JSON.parse(rawBody);
  const headers = request.headers;

  const secret = process.env.WEBHOOK_LEMON_SECRET!;
  const hmac = crypto.createHmac("sha256", secret);

  hmac.update(rawBody);
  const digest = hmac.digest("hex");
  const xSignature = headers.get("X-Signature");
  if (
    !isDev() &&
    (!xSignature ||
      !crypto.timingSafeEqual(
        Buffer.from(digest, "hex"),
        Buffer.from(xSignature, "hex"),
      ))
  ) {
    return new Response("Invalid signature.", { status: 401 });
  }

  // save to database
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );


  const { error } = await supabase
    .from('webhook_lemon')
    .insert([{
      data: body
    }]);

  if (error) {
    console.error('Error inserting data:', error);
  }

  const data = body.data;
  if (data.type !== "orders") {
    return new Response("Incorrect order schema", { status: 200 });
  }

  if (data.attributes.status !== "paid") {
    return new Response("Payment Required", { status: 200 });
  }

  const userId = body.meta.custom_data.user_id
  const userEmail = data.attributes.user_email

  const firstOrderItem = data.attributes.first_order_item
  const variantName = firstOrderItem.variant_name
  const amount = Number(variantName.split(' ')[0])

  const { error: TransactionError } = await supabase
    .from("transactions")
    .insert({
      user_id: userId,
      email: userEmail ,
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


  return new Response(JSON.stringify("ok"), { status: 200 });
}
