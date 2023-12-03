// app/providers.tsx
"use client";

import { NextUIProvider } from "@nextui-org/react";
import { AnalyticsProvider } from "@/lib/hooks/use-analytics";
import { Provider as JotaiProvider } from "jotai";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AnalyticsProvider>
      <JotaiProvider>
        <NextUIProvider>{children}</NextUIProvider>
      </JotaiProvider>
    </AnalyticsProvider>
  );
}
