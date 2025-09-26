import { Box } from "@saleor/macaw-ui-next";
import * as React from "react";

interface AppLogoProps {
  backgroundColor: string;
  children?: React.ReactNode;
}

export const AppLogo = ({ backgroundColor, children }: AppLogoProps) => (
  <Box
    width={10}
    height={10}
    display="flex"
    placeItems="center"
    borderRadius={3}
    data-test-id="app-logo"
    __backgroundColor={backgroundColor}
  >
    {children}
  </Box>
);
