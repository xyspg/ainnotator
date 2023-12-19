"use client";
import Image from "next/image";
import Link from "next/link";
import Uploader from "@/app/components/Uploader";
import { Header } from "@/app/components/Header";
import { Hero } from "@/app/(landing_page)/components/Hero";
import { PrimaryFeatures } from "@/app/(landing_page)/components/PrimaryFeatures";
import { SecondaryFeatures } from "@/app/(landing_page)/components/SecondaryFeatures";
import { CallToAction } from "@/app/(landing_page)/components/CallToAction";
import { Testimonials } from "@/app/(landing_page)/components/Testimonials";
import { Pricing } from "@/app/(landing_page)/components/Pricing";
import { Faqs } from "@/app/(landing_page)/components/Faqs";
import { Footer } from "@/app/(landing_page)/components/Footer";
import { useEffect } from "react";

import { useRefererStore } from "@/app/store";
import {useSearchParams} from "next/navigation";

export default function Home() {
    // const referer = useRefererStore((state) => state.referer);
    const searchParams = useSearchParams();
    const refererCode = searchParams.get("r");
    useEffect(() => {
        async function trackReferer() {
            if (refererCode) {
                await fetch("/api/refer/track", {
                    method: "POST",
                    body: JSON.stringify({"referer": refererCode}),
                    headers: {
                        "Content-Type": "application/json",
                    },
                })
            }
        }
        trackReferer();

    }, []);
    return (
    <main>
      <main>
        <Hero />
        <PrimaryFeatures />
        <SecondaryFeatures />
        {/*<CallToAction />*/}
        {/*<Testimonials />*/}
        {/*<Pricing />*/}
        {/*<Faqs />*/}
      </main>
      <Footer />
    </main>
  );
}

