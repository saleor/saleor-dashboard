import { OrderDetailsFragment } from "@dashboard/graphql";
import { Box, Button, PlusIcon, Skeleton } from "@saleor/macaw-ui-next";
import { FormattedMessage } from "react-intl";

import { addTransactionMessages } from "./messages";

interface OrderAddTransactionProps {
  order: OrderDetailsFragment;
  onAddTransaction: () => void;
}

const OrderAddTransaction = ({ order, onAddTransaction }: OrderAddTransactionProps) => {
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
