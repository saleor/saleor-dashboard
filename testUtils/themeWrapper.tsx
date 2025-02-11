import { ThemeProvider as LegacyThemeProvider } from "@saleor/macaw-ui";
import { ThemeProvider } from "@saleor/macaw-ui-next";
import { ReactNode } from "react";

export const ThemeWrapper = ({ children }: { children: ReactNode }) => (
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  <LegacyThemeProvider>
    <ThemeProvider>{children}</ThemeProvider>
  </LegacyThemeProvider>
);
