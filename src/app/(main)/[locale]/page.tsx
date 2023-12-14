"use client"
import Image from "next/image";
import Link from "next/link";
import Uploader from "@/app/components/Uploader";
import { Header } from "@/app/components/Header"
import { Hero } from "@/app/(landing_page)/components/Hero"
import { PrimaryFeatures } from "@/app/(landing_page)/components/PrimaryFeatures"
import { SecondaryFeatures } from "@/app/(landing_page)/components/SecondaryFeatures"
import { CallToAction } from "@/app/(landing_page)/components/CallToAction"
import { Testimonials } from "@/app/(landing_page)/components/Testimonials"
import { Pricing } from "@/app/(landing_page)/components/Pricing"
import { Faqs } from "@/app/(landing_page)/components/Faqs"
import { Footer } from "@/app/(landing_page)/components/Footer"


import { useUserStore } from "@/app/store";

export default function Home() {
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
