import { formatMoneyAmount } from "@dashboard/components/Money";
import useLocale from "@dashboard/hooks/useLocale";
import { IMoney } from "@dashboard/utils/intl";
import { Box, Text } from "@saleor/macaw-ui-next";

interface MoneyDisplayProps {
  label: string;
  money: IMoney;
}

export const MoneyDisplay = ({ label, money }: MoneyDisplayProps) => {
  const { locale } = useLocale();
  const amount = formatMoneyAmount(money, locale);

  return (
    <Box display="flex" flexDirection="column" alignItems="flex-end">
      <Text size={2} color="default2">
        {label}
      </Text>
      <Box as="span">
        <Text size={3}>{money.currency}&nbsp;</Text>
        <Text size={3} fontWeight="bold">
          {amount}
        </Text>
      </Box>
    </Box>
  );
};
