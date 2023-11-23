import type { Metadata } from "next";
import "./globals.css";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import clsx from "clsx";
import '@mantine/dropzone/styles.css';
import '@mantine/core/styles.css';

import { Inter } from "next/font/google";
import { MantineProvider, ColorSchemeScript } from '@mantine/core';

import { Providers } from "@/app/providers";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AInnotator",
  description: "Annotate Any PDFs with AI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={clsx(GeistSans.variable, GeistMono.variable, inter.className, "antialiased")}
      >
      <Providers>
        <MantineProvider>{children}</MantineProvider>
      </Providers>
      </body>
    </html>
  );
}
