/**
 * This is a webhook triggered route
 * Using supabase service role key
 */
import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";
import { createClient as cookieClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  console.log("ROUTE TRIGGERED");
  /**
   * Simple authentication
   */
  const credential = request.headers.get("x-credential");
  if (!credential) {
    return new Response("No credential", {
      status: 401,
    });
  }
  if (credential !== "0d00Onani") {
    return new Response("Invalid credential", {
      status: 401,
    });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
  const { data: unTrackedUsers, error } = await supabase
    .from("users")
    .select("*")
    .eq("refer_tracked", false)
    .neq("referred_by", null);

  const { data: allUsers, error: allUsersError } = await supabase
    .from("users")
    .select("*");

  if (!unTrackedUsers) {
    return new Response("No data found", {
      status: 404,
    });
  }
  console.log("--Untracked users--->", unTrackedUsers);
  // 推荐人 被推荐人
  async function handleRefer(referer: any, referee: any) {
    console.log(
      "---Adding Refer for",
      referer.email,
      "towards",
      referee.email,
      "---",
    );
    // update for refer
    const { data, error } = await supabase
      .from("referrals")
      .insert({
        referer_id: referer.id,
        referee_id: referee.id,
        referer_email: referer.email,
        referee_email: referee.email,
        referral_type: "SIGNUP",
        referral_amount: 50,
        initial_bonus: true,
      })
      .select();
    console.log("referral------>", data);

    // update referee
    const { error: creditError } = await supabase
      .from("users")
      .update({
        ainnotation_credit: referee.ainnotation_credit + 50,
      })
      .eq("id", referee.id);

    // update referer
    const { error: refererCreditError } = await supabase
      .from("users")
      .update({
        ainnotation_credit: referer.ainnotation_credit + 50,
      })
      .eq("id", referer.id);
    // change user metadata
    const { error: updateError } = await supabase
      .from("users")
      .update({
        refer_tracked: true,
      })
      .eq("id", referee.id);
    console.log(updateError, creditError, refererCreditError);
  }

  /**
   * Loop through all untracked users
   */
  for (const user of unTrackedUsers) {
    const { referred_by } = user;
    const referer = allUsers?.find((user) => user.referer_code === referred_by);
    if (!referer) {
      continue;
    }
    await handleRefer(referer, user);
  }

  /**
   * 初次注册 给被邀请者和邀请者赠送 50 Credit
   */

  return new Response("ok", {
    status: 200,
  });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  if (!searchParams.has("refererCode")) {
    return new Response(JSON.stringify({ message: "No referer code given" }), {
      status: 400,
    });
  }
  const cookieStore = cookies();
  const supabase = cookieClient(cookieStore);
  const refererCode = searchParams.get("refererCode");
  const { data, error } = await supabase
    .from("users")
    .select("id, referer_code")
    .eq("referer_code", refererCode)
    .single();
  if (!data) {
    return new Response("Referer Code Not Found", {
      status: 404,
    });
  }
  if (error) {
    //@ts-expect-error
    return new Response(error.message, {
      status: 500,
    });
  }

  return new Response(JSON.stringify(data.id), {
    status: 200,
  });
}
