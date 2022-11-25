import { Typography } from "@material-ui/core";
import { formatMoneyAmount } from "@saleor/components/Money";
import useLocale from "@saleor/hooks/useLocale";
import { IMoney } from "@saleor/utils/intl";
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
    <dl className={classes.wrapper}>
      <dt className={classes.label}>{label}</dt>
      <Typography
        component="dd"
        variant="body2"
        className={classes.moneyWrapper}
      >
        <span className={classes.currency}>{money.currency}&nbsp;</span>
        <span className={classes.amount}>{amount}</span>
      </Typography>
    </dl>
  );
};
