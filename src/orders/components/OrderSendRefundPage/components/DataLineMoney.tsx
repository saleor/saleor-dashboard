import { formatMoneyAmount } from "@saleor/components/Money";
import useLocale from "@saleor/hooks/useLocale";
import { IMoney } from "@saleor/utils/intl";
import React from "react";

import { useDataLineMoneyStyles } from "../styles";

interface DataLineMoneyProps {
  money: IMoney;
}

export const DataLineMoney: React.FC<DataLineMoneyProps> = ({ money }) => {
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
