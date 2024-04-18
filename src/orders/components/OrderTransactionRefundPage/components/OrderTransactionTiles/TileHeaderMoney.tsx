import { formatMoneyAmount } from "@dashboard/components/Money";
import { TransactionItemFragment } from "@dashboard/graphql";
import useLocale from "@dashboard/hooks/useLocale";
import { Text } from "@saleor/macaw-ui-next";
import React from "react";

import { getTransactionMoneyAmount } from "./utils";

interface TileHeaderMoneyProps {
  transaction: TransactionItemFragment;
}

export const TileHeaderMoney = ({ transaction }: TileHeaderMoneyProps) => {
  const { locale } = useLocale();
  const money = getTransactionMoneyAmount(transaction);

  if (!money) {
    return null;
  }

  const amount = formatMoneyAmount(money, locale);

  return (
    <Text fontSize={1} color="default2">
      <span>{money.currency}&nbsp;</span>
      <span>{amount}</span>
    </Text>
  );
};
