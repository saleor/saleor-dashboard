import { formatMoneyAmount } from "@dashboard/components/Money";
import useLocale from "@dashboard/hooks/useLocale";
import { IMoney } from "@dashboard/utils/intl";
import React from "react";

import { useDataLineMoneyStyles } from "../styles";

interface DataLineMoneyProps {
  money: IMoney;
}

export const DataLineMoney = ({ money }: DataLineMoneyProps) => {
  const { locale } = useLocale();
  const classes = useDataLineMoneyStyles();

  if (!money) {
    return null;
  }

  const amount = formatMoneyAmount(money, locale);

  return (
    <span>
      <span>{money.currency}</span>
      &nbsp;
      <span className={classes.amount}>{amount}</span>
    </span>
  );
};
