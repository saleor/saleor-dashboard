import { AppLogo } from "@dashboard/apps/types";
import { Box, GenericAppIcon } from "@saleor/macaw-ui/next";
import React from "react";

const avatarSize = 12;

export const AppAvatar: React.FC<{
  logo?: AppLogo | undefined;
}> = ({ logo }) => (
  <Box
    padding={1}
    backgroundColor="surfaceNeutralSubdued"
    width={avatarSize}
    height={avatarSize}
    display="flex"
    placeItems="center"
    borderRadius={2}
  >
    {logo?.source ? (
      <Box as="img" src={logo.source} />
    ) : (
      <GenericAppIcon size="large" color="iconNeutralSubdued" />
    )}
  </Box>
);
