/* eslint-disable sort-keys */
import { ConfirmButtonTransitionState } from "@saleor/components/ConfirmButton";
import useNotifier from "@saleor/hooks/useNotifier";
import { OrderDiscountCommonInput } from "@saleor/orders/components/OrderDiscountCommonModal/types";
import {
  useOrderDiscountAddMutation,
  useOrderDiscountDeleteMutation,
  useOrderDiscountUpdateMutation
} from "@saleor/orders/mutations";
import { OrderDetails_order } from "@saleor/orders/types/OrderDetails";
import { OrderDiscountAdd } from "@saleor/orders/types/OrderDiscountAdd";
import { OrderDiscountDelete } from "@saleor/orders/types/OrderDiscountDelete";
import { OrderDiscountUpdate } from "@saleor/orders/types/OrderDiscountUpdate";
import React, { createContext } from "react";
import { useIntl } from "react-intl";

import { OrderDiscountConsumerCommonProps, OrderDiscountData } from "./types";
import { getDiscountNotifierData, useDiscountDialog } from "./utils";
import { getManualOrderDiscount, getParsedDiscountData } from "./utils";

export interface OrderDiscountContextConsumerProps
  extends OrderDiscountConsumerCommonProps {
  orderDiscountAddStatus: ConfirmButtonTransitionState;
  orderDiscountRemoveStatus: ConfirmButtonTransitionState;
  orderDiscount?: OrderDiscountData;
  addOrderDiscount: (data: OrderDiscountCommonInput) => void;
  removeOrderDiscount: () => void;
}

interface OrderDiscountProviderProps {
  children: React.ReactNode;
  order?: OrderDetails_order;
}

export const OrderDiscountProvider: React.FC<OrderDiscountProviderProps> = ({
  children,
  order
}) => {
  const intl = useIntl();
  const notify = useNotifier();

  const { id: orderId } = order;

  const { isDialogOpen, openDialog, closeDialog } = useDiscountDialog();

  const orderDiscount = getManualOrderDiscount(order);

  const [orderDiscountAdd, orderDiscountAddOpts] = useOrderDiscountAddMutation({
    onCompleted: ({ orderDiscountAdd: { errors } }: OrderDiscountAdd) =>
      handleDiscountDataSubmission(errors)
  });

  const [
    orderDiscountUpdate,
    orderDiscountUpdateOpts
  ] = useOrderDiscountUpdateMutation({
    onCompleted: ({ orderDiscountUpdate: { errors } }: OrderDiscountUpdate) =>
      handleDiscountDataSubmission(errors)
  });

  const [
    orderDiscountRemove,
    orderDiscountRemoveOpts
  ] = useOrderDiscountDeleteMutation({
    onCompleted: ({ orderDiscountDelete: { errors } }: OrderDiscountDelete) =>
      handleDiscountDataSubmission(errors)
  });

  const handleDiscountDataSubmission = (errors: any[]) => {
    closeDialog();
    notify(getDiscountNotifierData(errors, intl));
  };

  const addOrderDiscount = (data: OrderDiscountCommonInput) =>
    orderDiscountAdd({
      variables: {
        orderId,
        input: getParsedDiscountData(data)
      }
    });

  const updateOrderDiscount = (data: OrderDiscountCommonInput) =>
    orderDiscount &&
    orderDiscountUpdate({
      variables: {
        discountId: orderDiscount?.id,
        input: getParsedDiscountData(data)
      }
    });

  const removeOrderDiscount = () =>
    orderDiscount &&
    orderDiscountRemove({ variables: { discountId: orderDiscount.id } });

  const orderDiscountAction = orderDiscount
    ? updateOrderDiscount
    : addOrderDiscount;

  const orderDiscountAddStatus = orderDiscount
    ? orderDiscountUpdateOpts.status
    : orderDiscountAddOpts.status;

  const discountProviderValues: OrderDiscountContextConsumerProps = {
    orderDiscountAddStatus,
    orderDiscountRemoveStatus: orderDiscountRemoveOpts.status,
    orderDiscount,
    addOrderDiscount: orderDiscountAction,
    removeOrderDiscount,
    isDialogOpen,
    closeDialog,
    openDialog,
    discountedPrice: order.total.gross,
    undiscountedPrice: order.undiscountedTotal.gross
  };

  return (
    <OrderDiscountContext.Provider value={discountProviderValues}>
      {children}
    </OrderDiscountContext.Provider>
  );
};

export const OrderDiscountContext = createContext<
  OrderDiscountContextConsumerProps
>(null);
