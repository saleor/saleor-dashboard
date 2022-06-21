/* eslint-disable @typescript-eslint/no-empty-function */
import { OrderDetailsQuery } from "@saleor/graphql";
import {
  OrderDiscountContext,
  OrderDiscountContextConsumerProps,
} from "@saleor/products/components/OrderDiscountProviders/OrderDiscountProvider";
import {
  OrderLineDiscountContext,
  OrderLineDiscountContextConsumerProps,
} from "@saleor/products/components/OrderDiscountProviders/OrderLineDiscountProvider";
import React from "react";

export const getDiscountsProvidersWrapper = (
  order: OrderDetailsQuery["order"],
) => {
  const mockedCommonDiscountProviderValues = {
    openDialog: () => {},
    closeDialog: () => {},
    isDialogOpen: false,
    undiscountedPrice: order.total.gross,
    discountedPrice: order.total.gross,
  };

  const MockOrderDiscountProvider = ({ children }) => {
    const mockedOrderDiscountProviderValues: OrderDiscountContextConsumerProps = {
      ...mockedCommonDiscountProviderValues,
      orderDiscountAddStatus: "default",
      orderDiscountRemoveStatus: "default",
      orderDiscount: null,
      addOrderDiscount: () => {},
      removeOrderDiscount: () => {},
    };

    return (
      <OrderDiscountContext.Provider value={mockedOrderDiscountProviderValues}>
        {children}
      </OrderDiscountContext.Provider>
    );
  };

  const MockOrderLineDiscountProvider = ({ children }) => {
    const mockedOrderDiscountProviderValues = (): OrderLineDiscountContextConsumerProps => ({
      ...mockedCommonDiscountProviderValues,
      addOrderLineDiscount: () => {},
      removeOrderLineDiscount: () => {},
      orderLineDiscount: null,
      orderLineDiscountUpdateStatus: "default",
      orderLineDiscountRemoveStatus: "default",
    });

    return (
      <OrderLineDiscountContext.Provider
        value={mockedOrderDiscountProviderValues}
      >
        {children}
      </OrderLineDiscountContext.Provider>
    );
  };

  const DiscountWrapper = storyFn => (
    <MockOrderDiscountProvider>
      <MockOrderLineDiscountProvider>{storyFn()}</MockOrderLineDiscountProvider>
    </MockOrderDiscountProvider>
  );

  return DiscountWrapper;
};
