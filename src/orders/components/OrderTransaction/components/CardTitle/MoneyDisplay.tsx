import { formatMoneyAmount } from "@dashboard/components/Money";
import useLocale from "@dashboard/hooks/useLocale";
import { IMoney } from "@dashboard/utils/intl";
import React from "react";

import { useMoneyDisplayStyles } from "./styles";

interface MoneyDisplayProps {
  label: string;
  money: IMoney;
}

export const MoneyDisplay = ({ label, money }: MoneyDisplayProps) => {
  const { locale } = useLocale();
  const classes = useMoneyDisplayStyles();
  const amount = formatMoneyAmount(money, locale);

  return (
    <div className={classes.wrapper}>
      <div>{label}</div>
      <div>
        <span>{money.currency}&nbsp;</span>
        <span>{amount}</span>
      </div>
    </div>
  );
};
