import type { Metadata } from "next";

import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Inter, Lexend } from "next/font/google";
import Script from "next/script";
import "@mantine/core/styles.css";
import "@mantine/dropzone/styles.css";

import { MantineProvider } from "@mantine/core";
import { Providers } from "@/app/providers";

import clsx from "clsx";
import "./globals.css";

export const metadata: Metadata = {
  title: "AInnotator",
  description: "Annotate Any PDFs with AI",
};

const inter = Inter({ subsets: ["latin"] });

const lexend = Lexend({ subsets: ["latin"] });

export default function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: {
    locale: string;
  };
}) {
  return (
    <html lang={locale}>
      <Script
        src="https://analytics.xyspg.moe/script.js"
        data-website-id="e71f6eac-cb58-4f71-a21d-fb10c75394a2"
        async
      />
      <body
        className={clsx(
          GeistSans.variable,
          GeistMono.variable,
          inter.className,
          lexend.className,
          "antialiased",
        )}
      >
        <Providers>
          <MantineProvider>{children}</MantineProvider>
        </Providers>
      </body>
    </html>
  );
}
