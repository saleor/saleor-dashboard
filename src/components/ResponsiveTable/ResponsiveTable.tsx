import { Theme } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import { makeStyles } from "@material-ui/styles";
import React from "react";

const useStyles = makeStyles(
  (theme: Theme) => ({
    [theme.breakpoints.up("sm")]: {
      "& table": {
        tableLayout: "fixed"
      }
    },
    root: {
      "& table": {
        tableLayout: "auto"
      },
      overflowX: "auto"
    }
  }),
  {
    name: "ResponsiveTable"
  }
);

interface ResponsiveTableProps {
  children: React.ReactNode | React.ReactNodeArray;
  className?: string;
  key?: string;
}

const ResponsiveTable: React.FC<ResponsiveTableProps> = props => {
  const { children, className, key } = props;

  const classes = useStyles(props);

  return (
    <div className={classes.root}>
      <Table className={className} key={key}>
        {children}
      </Table>
    </div>
  );
};

ResponsiveTable.displayName = "ResponsiveTable";
export default ResponsiveTable;
