// @ts-strict-ignore
import { ReorderAction } from "@dashboard/types";
import { TableBody } from "@material-ui/core";
import { TableBodyProps } from "@material-ui/core/TableBody";
import { makeStyles } from "@saleor/macaw-ui";
import { createContext, useContext } from "react";
import { SortableContainer } from "react-sortable-hoc";

const SortableContext = createContext({ disabled: false });

export const useSortableContext = () => useContext(SortableContext);

const InnerSortableTableBody = SortableContainer<TableBodyProps>(({ children, ...props }) => (
  <TableBody {...props}>{children}</TableBody>
));

interface SortableTableBodyProps {
  onSortEnd: ReorderAction;
  disabled?: boolean;
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

/** @deprecated This component should use @dnd-kit instead of react-sortable-hoc */
export const SortableTableBody = ({
  disabled,
  children,
  ...props
}: Omit<TableBodyProps & SortableTableBodyProps, "ref">) => {
  const classes = useStyles({});

  return (
    <SortableContext.Provider value={{ disabled: !!disabled }}>
      <InnerSortableTableBody
        helperClass={classes.ghost}
        axis="y"
        lockAxis="y"
        useDragHandle
        shouldCancelStart={() => !!disabled}
        {...props}
      >
        {children}
      </InnerSortableTableBody>
    </SortableContext.Provider>
  );
};
