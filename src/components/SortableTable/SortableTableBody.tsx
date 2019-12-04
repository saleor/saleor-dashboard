import makeStyles from "@material-ui/core/styles/makeStyles";
import TableBody, { TableBodyProps } from "@material-ui/core/TableBody";
import React from "react";
import { SortableContainer } from "react-sortable-hoc";

import { ReorderAction } from "@saleor/types";

const InnerSortableTableBody = SortableContainer<TableBodyProps>(
  ({ children, ...props }) => <TableBody {...props}>{children}</TableBody>
);

export interface SortableTableBodyProps {
  onSortEnd: ReorderAction;
}

const useStyles = makeStyles(
  theme => ({
    ghost: {
      "& td": {
        borderBottom: "none"
      },
      background: theme.palette.background.paper,
      fontFamily: theme.typography.fontFamily,
      // FIXME: you damn know what
      // fontSize: theme.overrides.MuiTableCell.root.fontSize,
      opacity: 0.5
    }
  }),
  { name: "SortableTableBody" }
);

const SortableTableBody: React.FC<
  Omit<TableBodyProps & SortableTableBodyProps, "ref">
> = props => {
  const classes = useStyles({});

  return (
    <InnerSortableTableBody
      helperClass={classes.ghost}
      axis="y"
      lockAxis="y"
      useDragHandle
      {...props}
    />
  );
};

export default SortableTableBody;
