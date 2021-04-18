import TableCell, { TableCellProps } from "@material-ui/core/TableCell";
import { makeStyles } from "@saleor/theme";
import classNames from "classnames";
import React from "react";

import Avatar, { AvatarProps } from "./Avatar";

const useStyles = makeStyles(
  theme => ({
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

interface TableCellAvatarProps extends AvatarProps, TableCellProps {
  className?: string;
}

const TableCellAvatar: React.FC<TableCellAvatarProps> = props => {
  const { className, ...rest } = props;

  const classes = useStyles(props);

  return (
    <TableCell className={classNames(classes.root, className)} {...rest}>
      <Avatar {...rest} />
    </TableCell>
  );
};

export default TableCellAvatar;
