import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";
import TableCell from "@material-ui/core/TableCell";
import React from "react";

import { stopPropagation } from "../../misc";
import { ICONBUTTON_SIZE } from "../../theme";

export interface IconButtonTableCellProps {
  children: React.ReactNode;
  disabled?: boolean;
  onClick: () => void;
}

const useStyles = makeStyles(
  theme => ({
    root: {
      "&:last-child": {
        paddingRight: 0
      },
      paddingRight: 0,
      width: ICONBUTTON_SIZE + theme.spacing(0.5)
    }
  }),
  { name: "IconButtonTableCell" }
);
const IconButtonTableCell: React.FC<IconButtonTableCellProps> = props => {
  const {
    children,

    disabled,
    onClick
  } = props;

  const classes = useStyles(props);

  return (
    <TableCell className={classes.root}>
      <IconButton
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
