"use client";
import { Theme } from "@radix-ui/themes";
import React from "react";
import ClientThemeProvider from "./ClientThemeProvider";
export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ClientThemeProvider>
      <Theme panelBackground="translucent">{children}</Theme>
    </ClientThemeProvider>
  );
}
