// @ts-strict-ignore
import { ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import {
  MoneyFragment,
  OrderDetailsFragment,
  useOrderLineDiscountRemoveMutation,
  useOrderLineDiscountUpdateMutation,
} from "@dashboard/graphql";
import useNotifier from "@dashboard/hooks/useNotifier";
import { getDefaultNotifierSuccessErrorData } from "@dashboard/hooks/useNotifier/utils";
import { getById } from "@dashboard/misc";
import { OrderDiscountCommonInput } from "@dashboard/orders/components/OrderDiscountCommonModal/types";
import React, { createContext, useContext, useState } from "react";
import { useIntl } from "react-intl";

import {
  GetOrderLineDiscountContextConsumerProps,
  OrderDiscountConsumerCommonProps,
  OrderLineDiscountConsumerProps,
  OrderLineDiscountData,
} from "./types";
import { getOrderLineDiscount, getParsedDiscountData, useDiscountDialog } from "./utils";

export interface OrderLineDiscountContextConsumerProps extends OrderDiscountConsumerCommonProps {
  addOrderLineDiscount: (data: OrderDiscountCommonInput) => void;
  removeOrderLineDiscount: () => void;
  orderLineDiscount?: OrderLineDiscountData;
  orderLineDiscountUpdateStatus: ConfirmButtonTransitionState;
  orderLineDiscountRemoveStatus: ConfirmButtonTransitionState;
  totalDiscountedPrice: MoneyFragment;
  unitUndiscountedPrice: MoneyFragment;
  unitDiscountedPrice: MoneyFragment;
}

interface DiscountProviderProps {
  children: React.ReactNode;
  order: OrderDetailsFragment;
}

export const OrderLineDiscountContext =
  createContext<GetOrderLineDiscountContextConsumerProps>(null);

export const useOrderLineDiscountContext = () => {
  const context = useContext(OrderLineDiscountContext);

  if (context === null) {
    throw new Error("You are outside order line discount context");
  }

  return context;
};

export const OrderLineDiscountProvider = ({ children, order }: DiscountProviderProps) => {
  const intl = useIntl();
  const notify = useNotifier();
  const { isDialogOpen, openDialog, closeDialog } = useDiscountDialog();
  const [currentLineId, setCurrentLineId] = useState<string | null>(null);
  const handleOpenDialog = (orderLineId: string) => () => {
    setCurrentLineId(orderLineId);
    openDialog();
  };
  const handleCloseDialog = () => {
    setCurrentLineId(null);
    closeDialog();
  };
  const [orderLineDiscountAddOrUpdate, orderLineDiscountAddOrUpdateOpts] =
    useOrderLineDiscountUpdateMutation({
      onCompleted: ({ orderLineDiscountUpdate: { errors } }) =>
        handleDiscountDataSubmission(errors),
    });
  const [orderLineDiscountRemove, orderLineDiscountRemoveOpts] = useOrderLineDiscountRemoveMutation(
    {
      onCompleted: ({ orderLineDiscountRemove: { errors } }) =>
        handleDiscountDataSubmission(errors),
    },
  );
  const handleDiscountDataSubmission = (errors: any[]) => {
    closeDialog();
    notify(getDefaultNotifierSuccessErrorData(errors, intl));
  };
  const addOrUpdateOrderLineDiscount = (orderLineId: string) => (input: OrderDiscountCommonInput) =>
    orderLineDiscountAddOrUpdate({
      variables: {
        orderLineId,
        input: getParsedDiscountData(input),
      },
    });
  const removeOrderLineDiscount = (orderLineId: string) => () =>
    orderLineDiscountRemove({ variables: { orderLineId } });
  const isOrderLineDialogOpen = (orderLineId: string) =>
    isDialogOpen && currentLineId === orderLineId;
  const getOrderLine = (orderLineId: string) => order?.lines.find(getById(orderLineId));
  const getDiscountProviderValues = (
    orderLineId: string,
  ): OrderLineDiscountContextConsumerProps => ({
    addOrderLineDiscount: addOrUpdateOrderLineDiscount(orderLineId),
    removeOrderLineDiscount: removeOrderLineDiscount(orderLineId),
    orderLineDiscount: getOrderLineDiscount(order, orderLineId),
    isDialogOpen: isOrderLineDialogOpen(orderLineId),
    orderLineDiscountUpdateStatus: orderLineDiscountAddOrUpdateOpts.status,
    orderLineDiscountRemoveStatus: orderLineDiscountRemoveOpts.status,
    closeDialog: handleCloseDialog,
    openDialog: handleOpenDialog(orderLineId),
    totalDiscountedPrice: getOrderLine(orderLineId).totalPrice.gross,
    unitDiscountedPrice: getOrderLine(orderLineId).unitPrice.gross,
    unitUndiscountedPrice: getOrderLine(orderLineId).undiscountedUnitPrice.gross,
  });

  return (
    <OrderLineDiscountContext.Provider value={getDiscountProviderValues}>
      {children}
    </OrderLineDiscountContext.Provider>
  );
};

export const OrderLineDiscountConsumer = ({
  children,
  orderLineId,
}: OrderLineDiscountConsumerProps) => (
  <OrderLineDiscountContext.Consumer>
    {(getValues: GetOrderLineDiscountContextConsumerProps) => children(getValues(orderLineId))}
  </OrderLineDiscountContext.Consumer>
);
