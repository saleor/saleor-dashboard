// @ts-strict-ignore
import CardSpacer from "@dashboard/components/CardSpacer";
import { OrderDetailsFragment, OrderDetailsQuery, TransactionActionEnum } from "@dashboard/graphql";
import { orderShouldUseTransactions } from "@dashboard/orders/types";

import { OrderSummary } from "../OrderSummary/OrderSummary";
import { OrderTransactionsWrapper } from "./OrderTransactionsWrapper";

export interface OrderPaymentOrTransactionProps {
  order: OrderDetailsFragment;
  shop: OrderDetailsQuery["shop"];
  onTransactionAction: (transactionId: string, actionType: TransactionActionEnum) => any;
  onPaymentCapture: () => any;
  onPaymentVoid: () => any;
  onPaymentRefund: () => any;
  onMarkAsPaid: () => any;
  onAddManualTransaction: () => any;
  onRefundAdd: () => void;
}

export const OrderPaymentOrTransaction = ({
  order,
  shop,
  onTransactionAction,
  onPaymentCapture,
  onPaymentVoid,
  onPaymentRefund,
  onMarkAsPaid,
  onAddManualTransaction,
  onRefundAdd,
}: OrderPaymentOrTransactionProps) => {
  // TODO: unify those sections - there should be one `OrderSummary` and then transactions or not  based on `orderShouldUseTransactions`
  if (orderShouldUseTransactions(order)) {
    return (
      <OrderTransactionsWrapper
        order={order}
        shop={shop}
        onTransactionAction={onTransactionAction}
        onPaymentCapture={onPaymentCapture}
        onMarkAsPaid={onMarkAsPaid}
        onPaymentVoid={onPaymentVoid}
        onAddManualTransaction={onAddManualTransaction}
        onRefundAdd={onRefundAdd}
      />
    );
  }

  return order ? (
    <>
      <OrderSummary
        order={order}
        onMarkAsPaid={onMarkAsPaid}
        useLegacyPaymentsApi
        onLegacyPaymentsApiCapture={onPaymentCapture}
        onLegacyPaymentsApiRefund={onPaymentRefund}
        onLegacyPaymentsApiVoid={onPaymentVoid}
      />
      <CardSpacer />
    </>
  ) : null;
};
