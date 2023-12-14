import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { PRODUCTS } from "@/lib/constant";

export async function POST(request: Request) {
  const cookieStore = cookies();

  const supabase = createClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
    });
  }
  const { productId, orderId } = await request.json();
  const product = PRODUCTS.find((item) => item.id === productId);
  if (!product) {
    return new Response(JSON.stringify({ message: "Product not found" }), {
      status: 404,
    });
  }
  const { data, error } = await supabase.from("orders").insert({
    user_id: user?.id,
    email: user?.email,
    product,
    order_id: orderId,
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
