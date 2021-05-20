import { Avatar as MuiAvatar } from "@material-ui/core";
import Cached from "@material-ui/icons/Cached";
import { makeStyles } from "@saleor/theme";
import classNames from "classnames";
import React from "react";

import Image from "../../icons/Image";

export const AVATAR_MARGIN = 32;

const useStyles = makeStyles(
  theme => ({
    alignRight: {
      justifyContent: "flex-end"
    },
    avatar: {
      background: "none",
      border: `1px solid ${theme.palette.divider}`,
      borderRadius: 2,
      color: "#bdbdbd",
      display: "inline-flex",
      padding: theme.spacing(0.5)
    },
    children: {
      alignSelf: "center",
      marginLeft: theme.spacing(2),
      width: "100%"
    },
    content: {
      alignItems: "center",
      display: "flex"
    },
    root: {
      "&:not(first-child)": {
        paddingLeft: 0
      },
      paddingRight: theme.spacing(3),
      width: "1%"
    }
  }),
  { name: "Avatar" }
);

export interface AvatarProps {
  thumbnail?: string;
  alignRight?: boolean;
  avatarProps?: string;
  children?: React.ReactNode | React.ReactNodeArray;
}

const Avatar: React.FC<AvatarProps> = ({
  children,
  alignRight,
  thumbnail,
  avatarProps
}) => {
  const classes = useStyles({});

  return (
    <div
      className={classNames(classes.content, {
        [classes.alignRight]: alignRight
      })}
    >
      {thumbnail === undefined ? (
        <MuiAvatar className={classNames(classes.avatar, avatarProps)}>
          <Cached color="primary" />
        </MuiAvatar>
      ) : thumbnail === null ? (
        <MuiAvatar className={classNames(classes.avatar, avatarProps)}>
          <Image color="primary" />
        </MuiAvatar>
      ) : (
        <MuiAvatar
          className={classNames(classes.avatar, avatarProps)}
          src={thumbnail}
        />
      )}
      {!alignRight && <div className={classes.children}>{children}</div>}
    </div>
  );
};

export default Avatar;
