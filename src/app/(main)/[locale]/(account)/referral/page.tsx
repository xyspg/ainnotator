import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { Separator } from "@/app/components/ui/separator";
import { Button } from "@/app/components/ui/button";
import React from "react";
import { Input } from "@/app/components/ui/input";
import { RefererLinkCopier } from "@/app/(main)/[locale]/(account)/referral/referer-client";

export default async function Page() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data, error } = await supabase
    .from("referrals")
    .select("*")
    .eq("referer_id", user?.id);
  console.log(data);

  /**
   * Get User Refer Link
   */
  const { data: referLink, error: referLinkError } = await supabase
    .from("users")
    .select("referer_code")
    .eq("id", user?.id)
    .single();
  console.log(referLink);

  const link = `https://ainnotator.com/signup?r=${referLink?.referer_code}`;

  const refereeCount = data?.length;

  /**
   * Get Referee Spendings
   */
  const { data: spending, error: spendingError } = await supabase
    .from("orders")
    .select("real_payment_amount")
    .in("user_id", data?.map((referral) => referral.referee_id))
    .eq("status", "completed");

  const totalRefereeSpending = spending?.reduce(
    (acc, curr) => acc + curr.real_payment_amount,
    0,
  );

  /**
   * Convert CNY to USD
   */
  const toUSD = (amt: number) => {
    // 2 digit
    return (amt / 7).toFixed(2);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="mb-4">
        <h1 className="text-3xl mb-6">Referrals</h1>
        <p>新用户注册，送免费 50 次 AInnotations</p>
        <p>朋友受邀注册，双方各“再”得免费 50 AInnotations</p>
        <p>邀请的朋友购买订单，返现 20%（满 $20 即可提现）</p>
      </div>
      <div className="">
        <h2>Share your referral link</h2>
        <RefererLinkCopier link={link} />
      </div>
      <Separator />
      <div className="">
        <h2>You have already invited {refereeCount} users.</h2>
        <p className="text-sm">
          {refereeCount * 50} Free Ainnotations Received (Maximum 1000)
        </p>
        <p className="text-sm">
          Earn 20% cashback when your friends purchases. Currently $
          {toUSD(totalRefereeSpending!)} (Payout at $20){" "}
        </p>

        {data?.map((referral) => (
          <React.Fragment key={referral.id}>
            <div>{referral.referee_email}</div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
