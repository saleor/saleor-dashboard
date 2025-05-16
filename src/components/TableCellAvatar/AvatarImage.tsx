import { Avatar as MuiAvatar } from "@material-ui/core";
import { ImageIcon } from "@saleor/macaw-ui";
import clsx from "clsx";
import React from "react";

import { useAvatarImageStyles } from "./styles";

interface AvatarImageProps {
  thumbnail?: string;
  avatarProps?: string;
}

const AvatarImage: React.FC<AvatarImageProps> = ({ thumbnail, avatarProps }) => {
  const classes = useAvatarImageStyles();

  if (!thumbnail) {
    return (
      <MuiAvatar className={clsx(classes.avatar, avatarProps)}>
        <ImageIcon color="primary" data-test-id="imageIcon" />
      </MuiAvatar>
    );
  }

  return <MuiAvatar className={clsx(classes.avatar, avatarProps)} src={thumbnail} />;
};

export default AvatarImage;
