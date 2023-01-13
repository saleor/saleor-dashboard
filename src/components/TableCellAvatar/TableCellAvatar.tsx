import { TableCell } from "@material-ui/core";
import { TableCellProps } from "@material-ui/core/TableCell";
import clsx from "clsx";
import React from "react";

import Avatar, { AvatarProps } from "./Avatar";
import { useStyles } from "./styles";

interface TableCellAvatarProps
  extends TableCellProps,
    Omit<AvatarProps, "children"> {
  className?: string;
}

const TableCellAvatar: React.FC<TableCellAvatarProps> = props => {
  const { className, ...rest } = props;

  const classes = useStyles(props);

  return (
    <TableCell
      className={clsx(classes.root, className)}
      data-test-id="table-cell-avatar"
      {...rest}
    >
      <Avatar {...rest} />
    </TableCell>
  );
};

export default TableCellAvatar;
