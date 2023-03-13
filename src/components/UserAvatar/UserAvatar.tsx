import { Avatar } from "@saleor/macaw-ui/next";
import React from "react";

interface UserAvatarProps {
  url?: string;
  initials?: string;
  className?: string;
  size?: "small" | "medium" | "large";
}

export const UserAvatar: React.FC<UserAvatarProps> = ({
  url,
  initials,
  ...rest
}) =>
  url ? (
    <Avatar.User scheme="decorative3" src={url} {...rest} />
  ) : (
    <Avatar.User scheme="decorative3" initials={initials} {...rest} />
  );
