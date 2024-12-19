import { makeStyles } from "@saleor/macaw-ui";
import * as React from "react";

const useStyles = makeStyles(
  theme => ({
    spacer: {
      [theme.breakpoints.down("sm")]: {
        marginTop: theme.spacing(2),
      },
      marginTop: theme.spacing(4),
    },
  }),
  { name: "CardSpacer" },
);

interface CardSpacerProps {
  children?: React.ReactNode;
}

export const CardSpacer = (props: CardSpacerProps) => {
  const { children } = props;
  const classes = useStyles(props);

  return <div className={classes.spacer}>{children}</div>;
};
CardSpacer.displayName = "CardSpacer";
export default CardSpacer;
