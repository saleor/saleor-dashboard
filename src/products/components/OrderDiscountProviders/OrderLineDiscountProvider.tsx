/* eslint-disable sort-keys */
import { ConfirmButtonTransitionState } from "@saleor/components/ConfirmButton";
import useNotifier from "@saleor/hooks/useNotifier";
import useShop from "@saleor/hooks/useShop";
import { OrderDiscountCommonInput } from "@saleor/orders/components/OrderDiscountCommonModal/types";
import { getById } from "@saleor/orders/components/OrderReturnPage/utils";
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
  GetOrderLineDiscountContextConsumerProps,
  OrderDiscountConsumerCommonProps,
  OrderLineDiscountConsumerProps,
  OrderLineDiscountData
} from "./types";
import {
  getDiscountNotifierData,
  getProperPrice,
  useDiscountDialog
} from "./utils";
import { getOrderLineDiscount, getParsedDiscountData } from "./utils";

export interface OrderLineDiscountContextConsumerProps
  extends OrderDiscountConsumerCommonProps {
  addOrderLineDiscount: (data: OrderDiscountCommonInput) => void;
  removeOrderLineDiscount: () => void;
  orderLineDiscount?: OrderLineDiscountData;
  orderLineDiscountUpdateStatus: ConfirmButtonTransitionState;
  orderLineDiscountRemoveStatus: ConfirmButtonTransitionState;
}

interface DiscountProviderProps {
  children: React.ReactNode;
  order: OrderDetails_order;
}

const DiscountContext = createContext<GetOrderLineDiscountContextConsumerProps>(
  null
);

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

  const isOrderLineDialogOpen = (orderLineId: string) =>
    isDialogOpen && currentLineId === orderLineId;

  const getOrderLine = (orderLineId: string) =>
    order?.lines.find(getById(orderLineId));

  const getProperDiscountPrice = getProperPrice(shop);

  const getDiscountProviderValues = (
    orderLineId: string
  ): OrderLineDiscountContextConsumerProps => ({
    addOrderLineDiscount: addOrUpdateOrderLineDiscount(orderLineId),
    removeOrderLineDiscount: removeOrderLineDiscount(orderLineId),
    orderLineDiscount: getOrderLineDiscount(order, orderLineId),
    isDialogOpen: isOrderLineDialogOpen(orderLineId),
    orderLineDiscountUpdateStatus: orderLineDiscountAddOrUpdateOpts.status,
    orderLineDiscountRemoveStatus: orderLineDiscountRemoveOpts.status,
    closeDialog: handleCloseDialog,
    openDialog: handleOpenDialog(orderLineId),
    discountedPrice: getProperDiscountPrice(
      getOrderLine(orderLineId).unitPrice
    ),
    undiscountedPrice: getProperDiscountPrice(
      getOrderLine(orderLineId).undiscountedUnitPrice
    )
  });

  return (
    <DiscountContext.Provider value={getDiscountProviderValues}>
      {children}
    </DiscountContext.Provider>
  );
};

export const OrderLineDiscountConsumer: React.FC<OrderLineDiscountConsumerProps> = ({
  children,
  orderLineId
}) => (
  <DiscountContext.Consumer>
    {(getValues: GetOrderLineDiscountContextConsumerProps) =>
      children(getValues(orderLineId))
    }
  </DiscountContext.Consumer>
);
