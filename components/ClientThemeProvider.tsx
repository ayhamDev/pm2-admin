"use client";

import { ThemeProvider } from "next-themes";

export default function ClientThemeProvider(props: React.PropsWithChildren) {
  return <ThemeProvider attribute="class">{props.children}</ThemeProvider>;
}
