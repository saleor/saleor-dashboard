import { makeStyles, Typography, TypographyProps } from "@material-ui/core";
import HorizontalSpacer from "@saleor/apps/components/HorizontalSpacer";
import React from "react";

export interface IMoney {
  amount: number;
  currency: string;
}

export interface MoneyProps extends TypographyProps {
  money: IMoney | null;
}

const useStyles = makeStyles(
  () => ({
    container: {
      display: "flex",
      alignItems: "baseline"
    }
  }),
  { name: "Money" }
);

export const Money: React.FC<MoneyProps> = ({ money, ...rest }) => {
  const classes = useStyles({});

  if (!money) {
    return null;
  }

  return (
    <div className={classes.container}>
      <Typography variant="caption" {...rest}>
        {money.currency}
      </Typography>
      <HorizontalSpacer spacing={0.5} />
      <Typography {...rest}>{money.amount.toFixed(2)}</Typography>
    </div>
  );
};

Money.displayName = "Money";
export default Money;
