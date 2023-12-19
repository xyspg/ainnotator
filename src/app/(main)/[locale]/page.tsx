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
import { RequestInfo } from "undici-types";

export default function Home() {
  // const referer = useRefererStore((state) => state.referer);
  const searchParams = useSearchParams();
  const refererCode = searchParams.get("r");
  const MAX_RETRIES = 10;

  async function fetchWithRetry(
    url: string,
    options: RequestInit | undefined,
    retries = 0,
  ) {
    try {
      const response = await fetch(url, options);

      if (response.ok) {
        return response.json();
      } else if (response.status === 401 && retries < MAX_RETRIES) {
        await delay(1000);
        return fetchWithRetry(url, options, retries + 1);
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  }

  function delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  useEffect(() => {
    async function trackReferer() {
      if (refererCode) {
        await fetchWithRetry("/api/refer/track", {
          method: "POST",
          body: JSON.stringify({ referer: refererCode }),
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });
      }
    }
    trackReferer();
  }, [refererCode]);
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

