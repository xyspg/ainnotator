import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { Separator } from "@/app/components/ui/separator";
import { Button } from "@/app/components/ui/button";
import React from "react";
import { Input } from "@/app/components/ui/input";
import { RefererLinkCopier } from "@/app/(main)/[locale]/(account)/referral/referer-client";
import {randomNanoID} from "@/lib/utils";
import {redirect} from "next/navigation";
import {getTranslations} from "next-intl/server";

export default async function Page() {
  const cookieStore = cookies();
  const t = await getTranslations('Settings.Referral')
  const supabase = createClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let referLink;

  const { data, error } = await supabase
    .from("referrals")
    .select("*")
    .eq("referer_id", user?.id);

  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("referer_code")
    .eq("id", user?.id)
    .single()

  /**
   * Get User Refer Link
   * If not exist, create one
   */
  referLink = userData?.referer_code;
  if (!referLink) {
    console.log("updating referer code");
    const generatedRefererCode = randomNanoID();
    referLink = generatedRefererCode;
    const { data: refererCode, error: refererCodeError } = await supabase.auth.updateUser({
      data: {
        referer_code: generatedRefererCode,
      }
    })
  }

  const link = `https://ainnotator.com/signup?r=${referLink}`;

  const refereeCount = data?.length;

  /**
   * Get Referee Spendings
   * 这里换成lemon了得把数据来源改一下，换成lemon的webhook callback
   * 单位为 cent
   */
  const { data: spending, error: spendingError } = await supabase
    .from("lemon_squeezy_webhook_data")
    .select("*")
    .in("user_id", data!.map((referral) => referral.referee_id))


  const totalRefereeSpending = spending?.reduce(
    (acc, curr) => acc + curr.total,
    0,
  );

  /**
   * Convert cent to USD
   */
  const toUSD = (amt: number) => {
    // 2 digit
    return (amt / 100).toFixed(2);
  };



  return (
    <div className="flex flex-col gap-4">
      <div className="mb-4">
        <h1 className="text-3xl mb-6">{t('title')}</h1>
        <p>新用户注册，送免费 50 次 AInnotations</p>
        <p>朋友受邀注册，双方各“再”得免费 50 AInnotations</p>
        {/*<p>邀请的朋友购买订单，返现 20%（满 $20 即可提现）</p>*/}
      </div>
      <div className="">
        <h2>Share your referral link</h2>
        <RefererLinkCopier link={link} />
      </div>
      <Separator />
      <div className="">
        <h2>{t('invitation_count', { count: refereeCount})}</h2>
        <p className="text-sm">
          {t('ainnotation_received', { count: refereeCount! * 50})}
        </p>
        {/*<p className="text-sm">*/}
        {/*  Earn 20% cashback when your friends purchases. Currently $*/}
        {/*  {toUSD(totalRefereeSpending! * 0.2)} (Payout at $20){" "}*/}
        {/*</p>*/}

        {data?.map((referral) => (
          <React.Fragment key={referral.id}>
            <div>{referral.referee_email}</div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
