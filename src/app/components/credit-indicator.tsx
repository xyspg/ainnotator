import {FaCoins} from "react-icons/fa";
import { useQuery } from "@supabase-cache-helpers/postgrest-swr";
import { createClient } from "@/lib/supabase/client";
import { cookies } from "next/headers";

export function CreditIndicator({ user }) {
    const supabase = createClient()
    const { data } = useQuery(
        supabase
            .from("users")
            .select("ainnotation_credit", { count: "exact" })
            .eq("id", user?.id),
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
        }
    )
    console.log("credit",data)
    return (
        <div className="flex flex-row items-center gap-1">
            <FaCoins/>
            {data?.[0]?.ainnotation_credit}
        </div>
    )
}