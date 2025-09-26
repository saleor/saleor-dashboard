import { makeStyles } from "@material-ui/core";
import clsx from "clsx";
import { PropsWithChildren } from "react";

const useStyles = makeStyles(
  theme => ({
    list: {
      ...theme.typography.body1,
      listStyle: "none",
      margin: 0,
      padding: 0,
      display: "flex",
      flexDirection: "column",
      gap: theme.spacing(1),

      "& dl": {
        margin: 0,
      },

      "& dd": {
        margin: 0,
      },
      lineHeight: 1.9,
      width: "100%",
    },
  }),
  { name: "SummaryList" },
);

export const SummaryList = ({ children, className }: PropsWithChildren<{ className?: string }>) => {
  const classes = useStyles();

  return <ul className={clsx(classes.list, className)}>{children}</ul>;
};
