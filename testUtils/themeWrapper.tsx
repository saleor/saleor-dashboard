// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck - use legacy theme wrappers

import { ThemeProvider as LegacyThemeProvider } from "@saleor/macaw-ui";
import { ThemeProvider } from "@saleor/macaw-ui-next";
import React from "react";

export const ThemeWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <LegacyThemeProvider>
      <ThemeProvider>{children}</ThemeProvider>
    </LegacyThemeProvider>
  );
};
