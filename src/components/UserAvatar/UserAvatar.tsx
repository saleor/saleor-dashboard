import { Avatar } from "@saleor/macaw-ui-next";
import * as React from "react";

interface UserAvatarProps {
  url?: string;
  initials?: string;
  className?: string;
  style?: React.CSSProperties;
  scheme?: "accent1" | "transparent";
  size?: "small" | "medium" | "large";
}

const defaultStyle: React.CSSProperties = {
  backgroundColor: "hsla(0, 0%, 0%, 0.08)",
  color: "hsla(0, 0%, 0%, 0.7)",
};

const smallStyle: React.CSSProperties = {
  ...defaultStyle,
  fontSize: "8px",
  fontWeight: 500,
};

export const UserAvatar = ({
  url,
  initials,
  scheme = "accent1",
  size,
  style,
  ...rest
}: UserAvatarProps) => {
  const baseStyle = size === "small" ? smallStyle : defaultStyle;
  const mergedStyle = { ...baseStyle, ...style };

  return url ? (
    <Avatar.User scheme={scheme} src={url} size={size} style={mergedStyle} {...rest} />
  ) : (
    <Avatar.User scheme={scheme} initials={initials} size={size} style={mergedStyle} {...rest} />
  );
};
