import { FaCoins } from "react-icons/fa";
import { createClient } from "@/lib/supabase/client";
import { cookies } from "next/headers";
import useSWR from "swr";
import Link from "next/link";

export function CreditIndicator() {
  //@ts-ignore
  const fetcher = (...args) => fetch(...args).then((res) => res.json());
  const { data, error } = useSWR("/api/credit", fetcher);
  const count = data?.count;
  return (
    <Link href="/pricing" target="_blank" className="flex flex-row items-center gap-1">
      <FaCoins />
      {count ? count : 0}
    </Link>
  );
}
