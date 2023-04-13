import useLocale from "@dashboard/hooks/useLocale";
import { IMoney } from "@dashboard/utils/intl";
import { makeStyles } from "@saleor/macaw-ui";
import React from "react";

import { formatMoneyAmount } from ".";

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

  return (
    <span className={classes.root} {...rest}>
      <span className={classes.currency}>{money.currency}</span>
      {formatMoneyAmount(money, locale)}
    </span>
  );
};

Money.displayName = "Money";
export default Money;
