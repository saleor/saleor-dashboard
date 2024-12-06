import { Box } from "@saleor/macaw-ui-next";

interface AppLogoProps {
  backgroundColor: string;
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
