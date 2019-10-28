import {
  createStyles,
  Theme,
  withStyles,
  WithStyles
} from "@material-ui/core/styles";
import React from "react";

const styles = theme =>
  createStyles({
    spacer: {
      [theme.breakpoints.down("sm")]: {
        marginTop: theme.spacing(1)
      },
      marginTop: theme.spacing(3)
    }
  });

interface CardSpacerProps extends WithStyles<typeof styles> {
  children?: React.ReactNode;
}

export const CardSpacer = withStyles(styles, { name: "CardSpacer" })(
  ({ classes, children }: CardSpacerProps) => (
    <div className={classes.spacer}>{children}</div>
  )
);
CardSpacer.displayName = "CardSpacer";
export default CardSpacer;
