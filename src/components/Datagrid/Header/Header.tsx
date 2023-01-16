import CardTitle from "@saleor/components/CardTitle";
import { makeStyles } from "@saleor/macaw-ui";
import React, { ReactNode } from "react";

interface HeaderProps {
  title: string;
  children: ReactNode;
}

const useStyles = makeStyles(
  theme => ({
    btnContainer: {
      display: "flex",
      flexDirection: "row-reverse",
      gap: theme.spacing(1),
    },
  }),
  { name: "DatagridHeader" },
);

export const Header = ({ title, children }: HeaderProps) => {
  const classes = useStyles();

  return (
    <CardTitle
      title={title}
      toolbar={<div className={classes.btnContainer}>{children}</div>}
    />
  );
};
