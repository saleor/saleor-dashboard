import Table from "@material-ui/core/Table";
import { makeStyles } from "@material-ui/styles";
import React from "react";

const useStyles = makeStyles(
  () => ({
    root: {
      overflowX: "auto"
    }
  }),
  {
    name: "ResponsiveTable"
  }
);

const ResponsiveTable: React.FC = props => {
  const { children } = props;

  const classes = useStyles(props);

  return (
    <div className={classes.root}>
      <Table>{children}</Table>
    </div>
  );
};

ResponsiveTable.displayName = "ResponsiveTable";
export default ResponsiveTable;
