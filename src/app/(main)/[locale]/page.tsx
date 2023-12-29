import React from "react";
import { HomePage } from "@/app/(main)/[locale]/homepage";
import { isDev } from "@/lib/utils";

const Page = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  const refererCode = searchParams?.r;

  await fetch(
    `${
      isDev() ? "http://localhost:3000" : "https://ainnotator"
    }/api/refer/track`,
    {
      method: "POST",
      body: JSON.stringify({ referer: refererCode }),
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    },
  );

  return (
    <>
      <HomePage />
    </>
  );
};

export default Page;
