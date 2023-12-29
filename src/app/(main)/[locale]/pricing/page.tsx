import { Pricing } from "@/app/(landing_page)/components/Pricing";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import {Footer} from "@/app/(landing_page)/components/Footer";

export default async function PricingPage() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return (
    <>
      <Pricing user={user} />
      <Footer />
    </>
  );
}
