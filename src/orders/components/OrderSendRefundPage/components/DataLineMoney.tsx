import useLocale from "@saleor/hooks/useLocale";
import { getMoneyFormatted, IMoney } from "@saleor/utils/intl";
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

  const amount = getMoneyFormatted(locale, money);

  return (
    <span>
      <span>{money.currency}</span>
      &nbsp;
      <span className={classes.amount}>{amount}</span>
    </span>
  );
};
