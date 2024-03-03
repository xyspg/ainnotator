import { NextIntlClientProvider, useMessages } from "next-intl";
import { getMessages } from 'next-intl/server'
import { notFound } from "next/navigation";
import { Header } from "@/app/components/Header";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server"; // Can be imported from a shared config

// Can be imported from a shared config
const locales = ["en", "zh-CN"];

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as any)) notFound();
  const messages = await getMessages()
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  return (
    <NextIntlClientProvider messages={messages}>
      <Header user={user} />
      {children}
    </NextIntlClientProvider>
  );
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}
