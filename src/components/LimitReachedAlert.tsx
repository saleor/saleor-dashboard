import { Alert, AlertProps, makeStyles } from "@saleor/macaw-ui";
import React from "react";

const useStyles = makeStyles(
  theme => ({
    root: {
      marginBottom: theme.spacing(3),
    },
  }),
  { name: "LimitReachedAlert" },
);

export type LimitReachedAlertProps = Omit<AlertProps, "variant" | "close">;

const LimitReachedAlert: React.FC<LimitReachedAlertProps> = props => {
  const classes = useStyles();

  return <Alert variant="warning" close className={classes.root} {...props} />;
};

LimitReachedAlert.displayName = "LimitReachedAlert";
export default LimitReachedAlert;
