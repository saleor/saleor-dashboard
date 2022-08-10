import { Table } from "@material-ui/core";
import { makeStyles } from "@saleor/macaw-ui";
import classNames from "classnames";
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
  key?: string;
}

const ResponsiveTable: React.FC<ResponsiveTableProps> = props => {
  const { children, className } = props;

  const classes = useStyles(props);

  return (
    <div className={classes.root}>
      <Table className={classNames(classes.table, className)}>{children}</Table>
    </div>
  );
};

ResponsiveTable.displayName = "ResponsiveTable";
export default ResponsiveTable;
