import { Avatar } from "@saleor/macaw-ui-next";
import { CSSProperties } from "react";

interface UserAvatarProps {
  url?: string;
  initials?: string;
  className?: string;
  style?: CSSProperties;
}

export const UserAvatar = ({ url, initials, ...rest }: UserAvatarProps) =>
  url ? (
    <Avatar.User scheme="accent1" src={url} {...rest} />
  ) : (
    <Avatar.User scheme="accent1" initials={initials} {...rest} />
  );
