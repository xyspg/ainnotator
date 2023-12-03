import {NextIntlClientProvider, useMessages} from "next-intl";
import {notFound} from 'next/navigation'; // Can be imported from a shared config

// Can be imported from a shared config
const locales = ["en", "zh-CN"];

export default function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as any)) notFound();
  const messages = useMessages();
  return (
    <NextIntlClientProvider messages={messages}>
      {children}
    </NextIntlClientProvider>
  );

}


export function generateStaticParams() {
  return locales.map((locale) => ({locale}));
}