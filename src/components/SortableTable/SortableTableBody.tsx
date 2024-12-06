// @ts-strict-ignore
import { ReorderAction } from "@dashboard/types";
import { TableBody } from "@material-ui/core";
import { TableBodyProps } from "@material-ui/core/TableBody";
import { makeStyles } from "@saleor/macaw-ui";
import { SortableContainer } from "react-sortable-hoc";

const InnerSortableTableBody = SortableContainer<TableBodyProps>(({ children, ...props }) => (
  <TableBody {...props}>{children}</TableBody>
));

export interface SortableTableBodyProps {
  onSortEnd: ReorderAction;
}

const useStyles = makeStyles(
  theme => ({
    ghost: {
      "& td": {
        borderBottom: "none",
      },
      background: theme.palette.background.paper,
      fontFamily: theme.typography.fontFamily,
      // FIXME: you damn know what
      // fontSize: theme.overrides.MuiTableCell.root.fontSize,
      opacity: 0.5,
    },
  }),
  { name: "SortableTableBody" },
);
const SortableTableBody = (props: Omit<TableBodyProps & SortableTableBodyProps, "ref">) => {
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
