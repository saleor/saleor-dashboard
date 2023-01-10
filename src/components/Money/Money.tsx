import useLocale from "@saleor/hooks/useLocale";
import { makeStyles } from "@saleor/macaw-ui";
import React from "react";

const useStyles = makeStyles(
  {
    root: {
      fontWeight: 500,
    },
    currency: {
      fontSize: "0.87em",
      marginRight: "0.2rem",
    },
  },
  { name: "Money" },
);

export interface IMoney {
  amount: number;
  currency: string;
}

export interface MoneyProps {
  money: IMoney | null;
}

export const Money: React.FC<MoneyProps> = props => {
  const { money, ...rest } = props;
  const { locale } = useLocale();
  const classes = useStyles();

  if (!money) {
    return null;
  }

  const currencyFractionDigits = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: money.currency,
  }).resolvedOptions().maximumFractionDigits;

  const amount = money.amount.toLocaleString(locale, {
    maximumFractionDigits: currencyFractionDigits,
    minimumFractionDigits: currencyFractionDigits,
  });

  return (
    <span className={classes.root} {...rest}>
      <span className={classes.currency}>{money.currency}</span>
      {amount}
    </span>
  );
};

Money.displayName = "Money";
export default Money;
