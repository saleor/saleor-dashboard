import { type OrderDetailsFragment } from "@dashboard/graphql";
import { OrderDetailsViewModel } from "@dashboard/orders/utils/OrderDetailsViewModel";
import { Button } from "@saleor/macaw-ui-next";
import { CheckIcon } from "lucide-react";
import { type ReactNode } from "react";
import { useIntl } from "react-intl";

import { transactionActionMessages } from "../OrderTransaction/messages";

type Props = {
  order: OrderDetailsFragment;
  onMarkAsPaid?: () => void;
};

/** Summary actions owned by the Transactions API view. */
export const TransactionsApiButtons = ({ order, onMarkAsPaid }: Props): ReactNode => {
  const intl = useIntl();
  const hasNoPayment = OrderDetailsViewModel.orderHasNoPayment(order);
  const canMarkAsPaid = OrderDetailsViewModel.canOrderBeMarkedAsPaid(order.actions);

  if (!hasNoPayment || !canMarkAsPaid || !onMarkAsPaid) {
    return null;
  }

  return (
    <Button variant="secondary" onClick={onMarkAsPaid} data-test-id="mark-as-paid-button">
      <CheckIcon size={16} />
      {intl.formatMessage(transactionActionMessages.markAsPaid)}
    </Button>
  );
};
