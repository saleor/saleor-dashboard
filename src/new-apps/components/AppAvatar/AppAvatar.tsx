import { AppLogo } from "@dashboard/new-apps/types";
import { Box, MarketplaceIcon } from "@saleor/macaw-ui/next";
import React from "react";

interface AppAvatarProps {
  logo: AppLogo | undefined;
  size: "medium" | "large";
}

export const AppAvatar = (props: AppAvatarProps) => {
  const { logo } = props;
  if (logo?.source) {
    return (
      <Box
        __backgroundColor={logo?.color}
        padding={3}
        width={11}
        height={11}
        borderRadius={2}
      >
        <Box as="img" src={logo.source} width={9} height={9} />
      </Box>
    );
  } else {
    return (
      <Box
        __backgroundColor={logo?.color}
        backgroundColor={logo?.color ? undefined : "surfaceNeutralSubdued"}
        padding={3}
        width={11}
        height={11}
        display="flex"
        placeItems="center"
        borderRadius={2}
      >
        {/** FIXME: Replace with generic app icon & recheck background color */}
        <MarketplaceIcon color="iconNeutralSubdued" />
      </Box>
    );
  }
};
