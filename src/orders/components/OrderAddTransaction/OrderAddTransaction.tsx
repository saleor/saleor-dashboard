import Skeleton from "@dashboard/components/Skeleton";
import { OrderDetailsFragment } from "@dashboard/graphql";
import { Box, Button, PlusIcon } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage } from "react-intl";

import { addTransactionMessages } from "./messages";

interface OrderAddTransactionProps {
  order: OrderDetailsFragment;
  onAddTransaction: () => void;
}

const OrderAddTransaction: React.FC<OrderAddTransactionProps> = ({ order, onAddTransaction }) => {
  if (!order) {
    return (
      <Box display="flex" justifyContent="flex-end" marginTop={2} marginBottom={2} paddingRight={4}>
        <Skeleton />
      </Box>
    );
  }

  return (
    <Button
      variant="secondary"
      onClick={onAddTransaction}
      data-test-id="captureManualTransactionButton"
    >
      <PlusIcon />
      <FormattedMessage {...addTransactionMessages.captureTransaction} />
    </Button>
  );
};

export default OrderAddTransaction;
