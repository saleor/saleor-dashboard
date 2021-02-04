import {
  OrderDiscountData,
  OrderLineDiscountData
} from "@saleor/orders/components/OrderLineDiscountModal/types";
import omit from "lodash-es/omit";
import React, { createContext, useState } from "react";

type OrderLineDiscountsData = Record<string, OrderLineDiscountData>;

export interface DiscountProviderValues {
  orderDiscount?: OrderDiscountData;
  orderLineDiscounts: OrderLineDiscountsData;
  addOrderDiscount: (data: OrderDiscountData) => void;
  addOrderLineDiscount: (data: OrderLineDiscountData) => void;
  removeOrderDiscount: () => void;
  removeOrderLineDiscount: (orderLineId: string) => void;
  isDiscountDialogOpen: boolean;
  openDialog: () => void;
  closeDialog: () => void;
}

interface DiscountProviderProps {
  children: React.ReactNode;
}

const DiscountContext = createContext<DiscountProviderValues>({});

export const DiscountProvider: React.FC<DiscountProviderProps> = ({
  children
}) => {
  const [isDiscountDialogOpen, setIsDiscountDialogOpen] = useState<boolean>(
    false
  );

  const [orderDiscount, setOrderDiscount] = useState<OrderDiscountData | null>(
    null
  );

  const [orderLineDiscounts, setOrderLineDiscounts] = useState<
    OrderLineDiscountsData
  >({});

  const withClosingDialog = (callback: (...args: any) => void) => (
    ...callbackArgs: any
  ) => {
    callback(...callbackArgs);
    setIsDiscountDialogOpen(false);
  };

  const addOrderDiscount = (data: OrderDiscountData) => setOrderDiscount(data);

  const addOrderLineDiscount = (data: OrderLineDiscountData) =>
    setOrderLineDiscounts({ ...orderLineDiscounts, [data.orderLineId]: data });

  const removeOrderDiscount = () => setOrderDiscount(null);

  const removeOrderLineDiscount = (orderLineId: string) =>
    setOrderLineDiscounts(omit(orderLineDiscounts, orderLineId));

  const discountProviderValues: DiscountProviderValues = {
    orderDiscount,
    orderLineDiscounts,
    addOrderDiscount: withClosingDialog(addOrderDiscount),
    addOrderLineDiscount,
    removeOrderDiscount: withClosingDialog(removeOrderDiscount),
    removeOrderLineDiscount,
    isDiscountDialogOpen,
    closeDialog: () => setIsDiscountDialogOpen(false),
    openDialog: () => setIsDiscountDialogOpen(true)
  };

  return (
    <DiscountContext.Provider value={discountProviderValues}>
      {children}
    </DiscountContext.Provider>
  );
};

interface DiscountConsumerProps {
  children: React.ReactNode;
}

export const DiscountConsumer: React.FC<DiscountConsumerProps> = ({
  children
}) => (
  <DiscountContext.Consumer>
    {(values: DiscountProviderValues) => children(values)}
  </DiscountContext.Consumer>
);
