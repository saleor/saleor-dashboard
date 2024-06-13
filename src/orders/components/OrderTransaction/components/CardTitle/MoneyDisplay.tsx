import { formatMoneyAmount } from "@dashboard/components/Money";
import useLocale from "@dashboard/hooks/useLocale";
import { IMoney } from "@dashboard/utils/intl";
import { Box, Text } from "@saleor/macaw-ui-next";
import React from "react";

interface MoneyDisplayProps {
  label: string;
  money: IMoney;
}

export const MoneyDisplay = ({ label, money }: MoneyDisplayProps) => {
  const { locale } = useLocale();
  const amount = formatMoneyAmount(money, locale);

  return (
    <Box display="flex" flexDirection="column">
      <Text size={1}>{label}</Text>
      <Box as="span">
        <Text fontWeight="bold">{money.currency}&nbsp;</Text>
        <Text fontWeight="bold">{amount}</Text>
      </Box>
    </Box>
  );
};
