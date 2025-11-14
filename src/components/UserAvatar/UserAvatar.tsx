import { Avatar } from "@saleor/macaw-ui-next";
import * as React from "react";

interface UserAvatarProps {
  url?: string;
  initials?: string;
  className?: string;
  style?: React.CSSProperties;
  scheme?: "accent1" | "transparent";
}

export const UserAvatar = ({ url, initials, scheme = "accent1", ...rest }: UserAvatarProps) => {
  const avatarScheme = scheme === "transparent" ? "accent1" : scheme;

  return url ? (
    <Avatar.User scheme={avatarScheme} src={url} {...rest} />
  ) : (
    <Avatar.User scheme={avatarScheme} initials={initials} {...rest} />
  );
};
