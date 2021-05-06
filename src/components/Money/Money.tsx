import React from "react";

import { LocaleConsumer } from "../Locale";

export interface IMoney {
  amount: number;
  currency: string;
}
export interface MoneyProps {
  money: IMoney | null;
}

export const formatMoney = (money: IMoney, locale: string) => {
  try {
    const formattedMoney = money.amount.toLocaleString(locale, {
      currency: money.currency,
      style: "currency"
    });
    return formattedMoney;
  } catch (error) {
    return `${money.amount} ${money.currency}`;
  }
};

export const Money: React.FC<MoneyProps> = ({ money }) =>
  money ? (
    <LocaleConsumer>
      {({ locale }) => formatMoney(money, locale)}
    </LocaleConsumer>
  ) : (
    <>-</>
  );

Money.displayName = "Money";
export default Money;
