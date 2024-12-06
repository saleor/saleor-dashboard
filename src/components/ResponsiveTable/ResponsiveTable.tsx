import { Table } from "@material-ui/core";
import { makeStyles } from "@saleor/macaw-ui";
import clsx from "clsx";
import React from "react";

const useStyles = makeStyles(
  theme => ({
    root: {
      overflowX: "auto",
      width: "100%",
    },
    table: {
      [theme.breakpoints.up("md")]: {
        tableLayout: "fixed",
      },
      tableLayout: "auto",
    },
  }),
  {
    name: "ResponsiveTable",
  },
);

interface ResponsiveTableProps {
  children: React.ReactNode | React.ReactNodeArray;
  className?: string;
  onMouseLeave?: () => void;
  key?: string;
}

const ResponsiveTable = (props: ResponsiveTableProps) => {
  const { children, className, onMouseLeave } = props;
  const classes = useStyles(props);

  return (
    <div className={classes.root}>
      <Table className={clsx(classes.table, className)} onMouseLeave={onMouseLeave}>
        {children}
      </Table>
    </div>
  );
};

ResponsiveTable.displayName = "ResponsiveTable";
export default ResponsiveTable;
