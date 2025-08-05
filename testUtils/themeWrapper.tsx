import React from 'react'
import { ThemeProvider as LegacyThemeProvider } from "@saleor/macaw-ui";
import { ThemeProvider } from "@saleor/macaw-ui-next";

export const ThemeWrapper = ({ children }: {children: React.ReactNode}) => (
    <LegacyThemeProvider>
        <ThemeProvider>
            {children}
        </ThemeProvider> 
    </LegacyThemeProvider>
)