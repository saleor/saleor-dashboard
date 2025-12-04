import { Avatar, vars } from "@saleor/macaw-ui-next";
import * as React from "react";

interface UserAvatarProps {
  url?: string;
  initials?: string;
  className?: string;
  style?: React.CSSProperties;
  scheme?: "accent1" | "transparent";
  size?: "small" | "medium" | "large";
}

export const UserAvatar = ({
  url,
  initials,
  scheme = "accent1",
  size,
  style,
  ...rest
}: UserAvatarProps) => {
  const defaultStyle: React.CSSProperties = {
    backgroundColor: vars.colors.background.default3,
    color: vars.colors.text.default1,
  };
  const mergedStyle = { ...defaultStyle, ...style };

  return url ? (
    <Avatar.User scheme={scheme} src={url} size={size} style={mergedStyle} {...rest} />
  ) : (
    <Avatar.User scheme={scheme} initials={initials} size={size} style={mergedStyle} {...rest} />
  );
};
