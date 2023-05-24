import { AppLogo } from "@dashboard/apps/types";
import { Box, GenericAppIcon } from "@saleor/macaw-ui/next";
import React from "react";

const avatarSize = "s8";

export const AppAvatar: React.FC<{
  logo?: AppLogo | undefined;
}> = ({ logo }) => {
  if (logo?.source) {
    return (
      <Box
        __backgroundColor={logo?.color}
        padding="s1"
        width={avatarSize}
        height={avatarSize}
        borderRadius={2}
        display="flex"
        placeItems="center"
      >
        <Box as="img" src={logo.source} />
      </Box>
    );
  } else {
    return (
      <Box
        __backgroundColor={logo?.color}
        backgroundColor="surfaceNeutralSubdued"
        padding="s1"
        width={avatarSize}
        height={avatarSize}
        display="flex"
        placeItems="center"
        borderRadius={2}
      >
        <GenericAppIcon size="large" color="iconNeutralSubdued" />
      </Box>
    );
  }
};
