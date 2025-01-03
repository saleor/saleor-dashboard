import { formatMoney } from "@dashboard/components/Money";
import { TransactionItemFragment } from "@dashboard/graphql";
import useLocale from "@dashboard/hooks/useLocale";
import { Box, Text } from "@saleor/macaw-ui-next";
import { FormattedMessage } from "react-intl";

import { transactionRefundTilesMessages } from "./messages";

interface TileHeaderMoneyProps {
  transaction: TransactionItemFragment;
}

export const TileHeaderMoney = ({ transaction }: TileHeaderMoneyProps) => {
  const { locale } = useLocale();
  const money = transaction.chargedAmount;

  if (!money) {
    return null;
  }

  const amount = formatMoney(money, locale);

  return (
    <Box display="flex" flexDirection="column" alignItems="end">
      <Text fontSize={1} color="default1">
        <FormattedMessage {...transactionRefundTilesMessages.charged} />
      </Text>
      <Text fontSize={1} color="default1">
        {amount}
      </Text>
    </Box>
  );
};
