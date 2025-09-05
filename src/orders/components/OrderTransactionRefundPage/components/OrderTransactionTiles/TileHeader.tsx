import { TransactionItemFragment } from "@dashboard/graphql";
import { Box, RadioGroup, Text } from "@saleor/macaw-ui-next";
import { FormattedMessage } from "react-intl";

import { transactionRefundTilesMessages } from "./messages";
import { TileHeaderMoney } from "./TileHeaderMoney";

interface TileHeaderProps {
  transaction: TransactionItemFragment;
  isDisabled?: boolean;
}

export const TileHeader = ({ transaction, isDisabled = false }: TileHeaderProps) => {
  return (
    <RadioGroup.Item
      position="relative"
      id={transaction.id}
      value={transaction.id}
      paddingX={4}
      disabled={isDisabled}
      width="100%"
      display="grid"
      __gridTemplateColumns="max-content 1fr"
    >
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Text
          size={5}
          fontWeight="medium"
          padding={4}
          color={isDisabled ? "defaultDisabled" : "default1"}
        >
          {transaction.name === "" ? (
            <FormattedMessage {...transactionRefundTilesMessages.defaultTransactionName} />
          ) : (
            transaction.name
          )}
        </Text>

        <TileHeaderMoney transaction={transaction} />
      </Box>
    </RadioGroup.Item>
  );
};
