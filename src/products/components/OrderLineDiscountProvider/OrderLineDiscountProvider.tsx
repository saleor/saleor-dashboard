import { ConfirmButtonTransitionState } from "@saleor/components/ConfirmButton";
import useNotifier from "@saleor/hooks/useNotifier";
import useShop from "@saleor/hooks/useShop";
import { OrderDiscountCommonInput } from "@saleor/orders/components/OrderDiscountCommonModal/types";
import {
  useOrderLineDiscountRemoveMutation,
  useOrderLineDiscountUpdateMutation
} from "@saleor/orders/mutations";
import { OrderDetails_order } from "@saleor/orders/types/OrderDetails";
import { OrderLineDiscountRemove } from "@saleor/orders/types/OrderLineDiscountRemove";
import { OrderLineDiscountUpdate } from "@saleor/orders/types/OrderLineDiscountUpdate";
import React, { createContext, useState } from "react";
import { useIntl } from "react-intl";

import {
  getOrderLineDiscount,
  getParsedDiscountData
} from "../OrderDiscountProvider/utils";
import {
  GetOrderLineDiscountProviderValues,
  OrderLineDiscountData
} from "./types";
import { getDiscountNotifierData, useDiscountDialog } from "./utils";

export interface OrderLineDiscountProviderValues {
  addOrderLineDiscount: (data: OrderDiscountCommonInput) => void;
  removeOrderLineDiscount: () => void;
  orderLineDiscount?: OrderLineDiscountData;
  isDialogOpen: boolean;
  openDialog: () => void;
  closeDialog: () => void;
  shouldUseGross: boolean;
  orderLineDiscountUpdateStatus: ConfirmButtonTransitionState;
  orderLineDiscountRemoveStatus: ConfirmButtonTransitionState;
}

interface DiscountProviderProps {
  children: React.ReactNode;
  order: OrderDetails_order;
}

const DiscountContext = createContext<GetOrderLineDiscountProviderValues>(null);

export const OrderLineDiscountProvider: React.FC<DiscountProviderProps> = ({
  children,
  order
}) => {
  const intl = useIntl();
  const notify = useNotifier();
  const shop = useShop();
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

  const [
    orderLineDiscountAddOrUpdate,
    orderLineDiscountAddOrUpdateOpts
  ] = useOrderLineDiscountUpdateMutation({
    onCompleted: ({
      orderLineDiscountUpdate: { errors }
    }: OrderLineDiscountUpdate) => handleDiscountDataSubmission(errors)
  });

  const [
    orderLineDiscountRemove,
    orderLineDiscountRemoveOpts
  ] = useOrderLineDiscountRemoveMutation({
    onCompleted: ({
      orderLineDiscountRemove: { errors }
    }: OrderLineDiscountRemove) => handleDiscountDataSubmission(errors)
  });

  const handleDiscountDataSubmission = (errors: any[]) => {
    closeDialog();
    notify(getDiscountNotifierData(errors, intl));
  };

  const addOrUpdateOrderLineDiscount = (orderLineId: string) => (
    input: OrderDiscountCommonInput
  ) =>
    orderLineDiscountAddOrUpdate({
      variables: { orderLineId, input: getParsedDiscountData(input) }
    });

  const removeOrderLineDiscount = (orderLineId: string) => () =>
    orderLineDiscountRemove({ variables: { orderLineId } });

  const shouldUseGross = shop.includeTaxesInPrices;

  const isOrderLineDialogOpen = (orderLineId: string) =>
    isDialogOpen && currentLineId === orderLineId;

  const getDiscountProviderValues = (
    orderLineId: string
  ): OrderLineDiscountProviderValues => ({
    addOrderLineDiscount: addOrUpdateOrderLineDiscount(orderLineId),
    removeOrderLineDiscount: removeOrderLineDiscount(orderLineId),
    orderLineDiscount: getOrderLineDiscount(order, orderLineId),
    isDialogOpen: isOrderLineDialogOpen(orderLineId),
    orderLineDiscountUpdateStatus: orderLineDiscountAddOrUpdateOpts.status,
    orderLineDiscountRemoveStatus: orderLineDiscountRemoveOpts.status,
    closeDialog: handleCloseDialog,
    openDialog: handleOpenDialog(orderLineId),
    shouldUseGross
  });

  return (
    <DiscountContext.Provider value={getDiscountProviderValues}>
      {children}
    </DiscountContext.Provider>
  );
};

interface DiscountConsumerProps {
  children: React.ReactNode;
  orderLineId: string;
}

export const OrderLineDiscountConsumer: React.FC<DiscountConsumerProps> = ({
  children,
  orderLineId
}) => (
  <DiscountContext.Consumer>
    {(getValues: GetOrderLineDiscountProviderValues) =>
      children(getValues(orderLineId))
    }
  </DiscountContext.Consumer>
);
