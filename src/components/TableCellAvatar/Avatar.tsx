import clsx from "clsx";
import React from "react";

import AvatarImage from "./AvatarImage";
import { useAvatarStyles } from "./styles";

export const AVATAR_MARGIN = 40;

export interface AvatarProps {
  thumbnail?: string;
  alignRight?: boolean;
  avatarProps?: string;
  children?: React.ReactNode | React.ReactNode[];
  badge?: React.ReactNode;
  className?: string;
}

const Avatar: React.FC<AvatarProps> = ({
  children,
  alignRight,
  thumbnail,
  avatarProps,
  badge,
  className,
}) => {
  const classes = useAvatarStyles();

  return (
    <div
      className={clsx(classes.content, className, {
        [classes.alignRight]: alignRight,
      })}
    >
      {badge}
      <AvatarImage thumbnail={thumbnail} avatarProps={avatarProps} />
      {!alignRight && <div className={classes.children}>{children}</div>}
    </div>
  );
};

export default Avatar;
