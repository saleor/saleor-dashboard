import { AppLogo } from "@dashboard/apps/types";
import { Box, GenericAppIcon } from "@saleor/macaw-ui/next";
import React from "react";

export const AppAvatar: React.FC<{
  logo?: AppLogo | undefined;
  size?: 8 | 12;
}> = ({ logo, size = 8 }) =>
  logo ? (
    <Box
      width={size}
      height={size}
      display="flex"
      placeItems="center"
      borderRadius={2}
    >
      <Box as="img" src={logo.source} />
    </Box>
  ) : (
    <Box
      padding={1}
      backgroundColor="surfaceNeutralSubdued"
      width={size}
      height={size}
      display="flex"
      placeItems="center"
      borderRadius={2}
    >
      <GenericAppIcon size="large" color="iconNeutralSubdued" />
    </Box>
  );
