import React from "react";
import { HomePage } from "@/app/(main)/[locale]/homepage";
import { isDev, randomNanoID } from "@/lib/utils";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

const Page = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  const refererCode = searchParams?.r;

  const supabase = createClient(cookies());
  const {
    data: { user },
  } = await supabase.auth.getUser();


  async function updateReferer(r: string) {
    const userRefererCode = user?.user_metadata.referer_code;
    // 如果已经被邀请过，就不更新
    if (!userRefererCode) {
      const generatedRefererCode = randomNanoID();
      const { data: refererCode, error: refererCodeError } =
        await supabase.auth.updateUser({
          data: {
            referer_code: generatedRefererCode,
            referred_by: r,
          },
        });
      // after saving to metadata, upload Public.Users
      const { data: refererCode2, error: refererCodeError2 } = await supabase
        .from("users")
        .update({
          referer_code: generatedRefererCode,
          referred_by: r,
        })
        .eq("id", user?.id);
    }
    /**
     * Trigger the webhook route
     */
    await fetch(
      isDev()
        ? `http://localhost:3000/api/refer`
        : `https://ainnotator.com/api/refer`,
      {
        method: "POST",
        headers: {
          "x-credential": "0d00Onani",
        },
      },
    );
  }
  if (refererCode && typeof refererCode === "string") {
    await updateReferer(refererCode);
  }

  return (
    <>
      <HomePage />
    </>
  );
};

export default Page;

