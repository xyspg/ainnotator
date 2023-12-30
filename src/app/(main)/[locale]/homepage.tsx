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

import {useMetaDataStore, useRefererStore} from "@/app/store";
import {useSearchParams} from "next/navigation";
import { RequestInfo } from "undici-types";
import {CookiePrompter} from "@/app/(main)/[locale]/cookie";
import {ClientOnly} from "@/lib/clientOnly";

export function HomePage() {
    const { metaData, setMetaData } = useMetaDataStore();
    const cookieShown = metaData.cookie_shown;

    const handleModalClose = () => {
        console.log("closed");
        setMetaData({ ...metaData, cookie_shown: true });
    };
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
                <ClientOnly>
                    {!cookieShown && (
                        <CookiePrompter onCookieClose={handleModalClose} />
                    )}
                </ClientOnly>
            </main>
            <Footer />
        </main>
    );
}

