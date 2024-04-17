import { TransactionItemFragment } from "@dashboard/graphql";
import { Box, RadioGroup, Text } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage } from "react-intl";

import { transactionRefundTilesMessages } from "./messages";

interface TileHeaderProps {
  transaction: TransactionItemFragment;
  isDisabled?: boolean;
}

export const TileHeader: React.FC<TileHeaderProps> = ({
  transaction,
  isDisabled = false,
}) => (
  <RadioGroup.Item
    id={transaction.id}
    value={transaction.id}
    paddingX={4}
    disabled={isDisabled}
    width="100%"
  >
    <Box display="flex" justifyContent="space-between" width="100%">
      <Text
        size={5}
        fontWeight="medium"
        padding={4}
        color={isDisabled ? "defaultDisabled" : "default1"}
      >
        {transaction.name === "" ? (
          <FormattedMessage
            {...transactionRefundTilesMessages.defaultTransactionName}
          />
        ) : (
          transaction.name
        )}
      </Text>
      {/* TODO: Need to use radix to make whole row clickable */}
    </Box>
  </RadioGroup.Item>
);
