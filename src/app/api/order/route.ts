import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { PRODUCTS } from "@/lib/constant";
import {isDev} from "@/lib/utils";
import {searchParamsToUrlQuery} from "next/dist/shared/lib/router/utils/querystring";

export async function POST(request: Request) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const { id, urlKey } = await request.json();
  const url =
    "https://2a17d224-cc7d-49e1-ac77-ed59c78064dd.mock.pstmn.io/order";
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
    });
  }

  const token = process.env.MIANBAODUO_X_TOKEN || "";
  const response = await fetch(
    isDev() ? url : `https://x.mbd.pub/api/order-detail?out_order_id=${id}`,
    {
      method: "GET",
      headers: {
        "x-token": token,
      },
    },
  );
  console.log(response);
  if (response.status === 404) {
    return new Response(
      JSON.stringify({ message: "Your order could not be found." }),
      {
        status: 404,
      },
    );
  }
  const merchantResponseData = await response.json();
  console.log(merchantResponseData);
  const resUrlKey = merchantResponseData.result.urlkey; // 面包多 Product ID

  // find the amount
  const product = PRODUCTS.find((item) => item.pid === resUrlKey);
  const amount = product ? product.amount : 0;

  // below is changed to always true for development
  if (resUrlKey === urlKey || process.env.NODE_ENV === "development") {
    // update order with merchant response
    const { data: orderData, error: UpdateError } = await supabase
      .from("orders")
      .update({
        status: "completed",
        merchant: merchantResponseData,
        payment_method: "mianbaoduo",
        real_payment_amount: merchantResponseData.result.real_amount,
      })
      .eq("order_id", id);

    const { error: TransactionError } = await supabase
      .from("transactions")
      .insert({
        user_id: user.id,
        email: user.email,
        type: "add",
        category: "Top Up",
        amount,
      });

    const { data: creditData, error: getCreditError } = await supabase
      .from("users")
      .select("ainnotation_credit")
      .eq("id", user.id);
    // [ { ainnotation_credit: 35 } ]
    console.log(creditData);

    const { error: UpdateCreditError } = await supabase
      .from("users")
      .update({
        ainnotation_credit: creditData?.[0].ainnotation_credit + amount,
      })
      .eq("id", user.id);

    if (
      UpdateError ||
      TransactionError ||
      getCreditError ||
      UpdateCreditError
    ) {
      console.error(
        UpdateError,
        TransactionError,
        getCreditError,
        UpdateCreditError,
      );
      return new Response(
        JSON.stringify({ message: "There is an error processing your order." }),
        {
          status: 404,
        },
      );
    }

    return new Response(JSON.stringify({ code: 200, message: "success" }), {
      status: 200,
    });
  }
  return new Response(
    JSON.stringify({ code: 404, message: "Your order could not be found." }),
    {
      status: 404,
    },
  );
}

export async function GET(request: Request) {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    // search param order id
    const searchParams = new URL(request.url).searchParams;
    const orderId = searchParams.get("order_id");
    if (!orderId) {
        return new Response(JSON.stringify({ message: "Order ID is required." }), {
            status: 404,
        });
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return new Response(JSON.stringify({ message: "Unauthorized" }), {
            status: 401,
        });
    }

    const { data: orderData, error } = await supabase
        .from("orders")
        .select("*")
        .eq("order_id", orderId)
        .single();


}