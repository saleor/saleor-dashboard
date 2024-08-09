import { Avatar as MuiAvatar } from "@material-ui/core";
import { ImageIcon } from "@saleor/macaw-ui";
import { Text } from "@saleor/macaw-ui-next";
import clsx from "clsx";
import React from "react";

import { useAvatarImageStyles } from "./styles";

interface AvatarImageProps {
  initials?: string;
  thumbnail?: string;
  avatarProps?: string;
}

const AvatarImage: React.FC<AvatarImageProps> = ({ initials, thumbnail, avatarProps }) => {
  const classes = useAvatarImageStyles();

  if (!thumbnail && initials) {
    return (
      <MuiAvatar className={clsx(classes.avatar, avatarProps)}>
        <Text size={6} fontWeight="bold" lineHeight={3}>
          {initials}
        </Text>
      </MuiAvatar>
    );
  }

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
