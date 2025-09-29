import { Avatar } from "@saleor/macaw-ui-next";
import * as React from "react";

interface UserAvatarProps {
  url?: string;
  initials?: string;
  className?: string;
  style?: React.CSSProperties;
  scheme?: "accent1" | "transparent";
}

export const UserAvatar = ({ url, initials, scheme = "accent1", ...rest }: UserAvatarProps) =>
  url ? (
    <Avatar.User scheme={scheme} src={url} {...rest} />
  ) : (
    <Avatar.User scheme={scheme} initials={initials} {...rest} />
  );
