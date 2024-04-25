import { AppLogo } from "@dashboard/apps/types";
import { Box, GenericAppIcon } from "@saleor/macaw-ui-next";
import React from "react";

type Logo = AppLogo | undefined;
type Size = 8 | 12;

export const AppAvatar: React.FC<{
  logo?: Logo;
  size?: Size;
}> = ({ logo, size = 8 }) =>
  logo ? (
    <Box width={size} height={size} display="flex" placeItems="center" borderRadius={2}>
      <Box as="img" src={logo.source} width="100%" />
    </Box>
  ) : (
    <Box
      backgroundColor="default2"
      width={size}
      height={size}
      display="flex"
      placeItems="center"
      borderRadius={2}
      borderWidth={1}
      borderColor="default1"
      borderStyle="solid"
    >
      <GenericAppIcon size="medium" color="default2" />
    </Box>
  );
