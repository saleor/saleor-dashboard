import genericAppImg from "@assets/images/app-generic.svg";
import { AppLogo } from "@dashboard/new-apps/types";
import { Box } from "@saleor/macaw-ui/next";
import React from "react";

interface AppAvatarProps {
  logo: AppLogo | undefined;
  size: "medium" | "large";
}

export const AppAvatar: React.FC<AppAvatarProps> = ({ logo, size }) => {
  const avatarSize = size === "medium" ? 11 : 13;

  if (logo?.source) {
    return (
      <Box
        __backgroundColor={logo?.color}
        padding={3}
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
        __backgroundColor={logo?.color ?? "#EAE8E9"}
        __color="#7C7F7F"
        padding={3}
        width={avatarSize}
        height={avatarSize}
        display="flex"
        placeItems="center"
        borderRadius={2}
      >
        <img src={genericAppImg} alt="" />
      </Box>
    );
  }
};
