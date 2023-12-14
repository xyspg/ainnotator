// app/providers.tsx
"use client";

import { NextUIProvider } from "@nextui-org/react";
import { Provider as JotaiProvider } from "jotai";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
      <JotaiProvider>
        <NextUIProvider>{children}</NextUIProvider>
      </JotaiProvider>
  );
}
