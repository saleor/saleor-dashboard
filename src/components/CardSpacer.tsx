import { makeStyles } from "@saleor/macaw-ui";
import { vars } from "@saleor/macaw-ui-next";
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
  backgroundColor?: keyof typeof vars.colors.background;
}

export const CardSpacer = ({ children, backgroundColor = "default1" }: CardSpacerProps) => {
  const classes = useStyles(children);

  return (
    <div
      className={classes.spacer}
      style={{
        backgroundColor: vars.colors.background[backgroundColor],
      }}
    >
      {children}
    </div>
  );
};
CardSpacer.displayName = "CardSpacer";
export default CardSpacer;
