import clsx from "clsx";
import React from "react";

import AvatarImage from "./AvatarImage";
import { useAvatarStyles } from "./styles";

export const AVATAR_MARGIN = 40;

export interface AvatarProps {
  initials?: string;
  thumbnail?: string;
  alignRight?: boolean;
  avatarProps?: string;
  children?: React.ReactNode | React.ReactNode[];
  badge?: React.ReactNode;
}

const Avatar: React.FC<AvatarProps> = ({
  children,
  alignRight,
  initials,
  thumbnail,
  avatarProps,
  badge,
}) => {
  const classes = useAvatarStyles();

  return (
    <div
      className={clsx(classes.content, {
        [classes.alignRight]: alignRight,
      })}
    >
      {badge}
      <AvatarImage
        thumbnail={thumbnail}
        initials={initials}
        avatarProps={avatarProps}
      />
      {!alignRight && <div className={classes.children}>{children}</div>}
    </div>
  );
};

export default Avatar;
