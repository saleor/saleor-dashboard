import { useOrderDetailsQuery } from "@dashboard/graphql";
import { resolveOrderPaymentMode } from "@dashboard/orders/resolveOrderPaymentMode";
import { type OrderReturnUrlQueryParams } from "@dashboard/orders/urls";
import { type ReactElement } from "react";

import { LegacyOrderReturn } from "./LegacyOrderReturn";
import { type OrderReturnViewProps } from "./orderReturnViewProps";
import { TransactionOrderReturn } from "./TransactionOrderReturn";

interface OrderReturnProps {
  orderId: string;
  params: OrderReturnUrlQueryParams;
}

const OrderReturn = ({ orderId, params }: OrderReturnProps): ReactElement => {
  const { data, loading } = useOrderDetailsQuery({
    displayLoader: true,
    variables: {
      id: orderId,
    },
  });
  const order = data?.order;
  const viewProps: OrderReturnViewProps = {
    orderId,
    order,
    loading,
    prefilledOrderLineId: params.lineId,
  };

  // The single payment-mode branch of the return route: resolve once, render
  // one concrete view. Until the order loads there is nothing to resolve, so
  // the legacy view renders the (order-less) skeleton, as it always has.
  return order && resolveOrderPaymentMode(order).kind === "transactions" ? (
    <TransactionOrderReturn {...viewProps} />
  ) : (
    <LegacyOrderReturn {...viewProps} />
  );
};

OrderReturn.displayName = "OrderReturn";
export default OrderReturn;
