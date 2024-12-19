import { TableCell } from "@material-ui/core";
import { IconButton, ICONBUTTON_SIZE, makeStyles } from "@saleor/macaw-ui";
import clsx from "clsx";
import * as React from "react";

import { stopPropagation } from "../../misc";

export interface IconButtonTableCellProps {
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  onClick: () => void;
}

const useStyles = makeStyles(
  theme => ({
    root: {
      "&:last-child": {
        paddingRight: 0,
      },
      paddingRight: 0,
      width: `calc(${ICONBUTTON_SIZE}px + ${theme.spacing(0.5)})`,
    },
  }),
  { name: "IconButtonTableCell" },
);
const IconButtonTableCell = (props: IconButtonTableCellProps) => {
  const { children, className, disabled, onClick } = props;
  const classes = useStyles(props);

  return (
    <TableCell className={clsx(classes.root, className)}>
      <IconButton
        data-test-id="delete-button"
        variant="secondary"
        color="primary"
        disabled={disabled}
        onClick={stopPropagation(onClick)}
      >
        {children}
      </IconButton>
    </TableCell>
  );
};

IconButtonTableCell.displayName = "IconButtonTableCell";
export default IconButtonTableCell;
