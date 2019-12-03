import { makeStyles } from "@material-ui/core/styles";
import React from "react";

const useStyles = makeStyles(
  theme => ({
    spacer: {
      [theme.breakpoints.down("sm")]: {
        marginTop: theme.spacing(1)
      },
      marginTop: theme.spacing(3)
    }
  }),
  { name: "CardSpacer" }
);

interface CardSpacerProps {
  children?: React.ReactNode;
}

export const CardSpacer: React.FC<CardSpacerProps> = props => {
  const { children } = props;

  const classes = useStyles(props);

  return <div className={classes.spacer}>{children}</div>;
};
CardSpacer.displayName = "CardSpacer";
export default CardSpacer;
