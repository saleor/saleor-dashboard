import Avatar from "@material-ui/core/Avatar";
import { makeStyles } from "@material-ui/core/styles";
import TableCell from "@material-ui/core/TableCell";
import Cached from "@material-ui/icons/Cached";
import classNames from "classnames";
import React from "react";

import Image from "../../icons/Image";

export const AVATAR_MARGIN = 32;

const useStyles = makeStyles(
  theme => ({
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
  { name: "TableCellAvatar" }
);

interface TableCellAvatarProps {
  className?: string;
  thumbnail?: string;
  avatarProps?: string;
  children?: React.ReactNode | React.ReactNodeArray;
}

const TableCellAvatar: React.FC<TableCellAvatarProps> = props => {
  const { children, className, thumbnail, avatarProps, ...rest } = props;

  const classes = useStyles(props);

  return (
    <TableCell className={classNames(classes.root, className)} {...rest}>
      <div className={classes.content}>
        {thumbnail === undefined ? (
          <Avatar className={classNames(classes.avatar, avatarProps)}>
            <Cached color="primary" />
          </Avatar>
        ) : thumbnail === null ? (
          <Avatar className={classNames(classes.avatar, avatarProps)}>
            <Image color="primary" />
          </Avatar>
        ) : (
          <Avatar
            className={classNames(classes.avatar, avatarProps)}
            src={thumbnail}
          />
        )}
        <div className={classes.children}>{children}</div>
      </div>
    </TableCell>
  );
};
TableCellAvatar.displayName = "TableCellAvatar";
export default TableCellAvatar;
