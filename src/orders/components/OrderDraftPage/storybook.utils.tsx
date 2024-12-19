// @ts-strict-ignore
/* eslint-disable @typescript-eslint/no-empty-function */
import { OrderDetailsQuery } from "@dashboard/graphql";
import {
  OrderDiscountContext,
  OrderDiscountContextConsumerProps,
} from "@dashboard/products/components/OrderDiscountProviders/OrderDiscountProvider";
import {
  OrderLineDiscountContext,
  OrderLineDiscountContextConsumerProps,
} from "@dashboard/products/components/OrderDiscountProviders/OrderLineDiscountProvider";

export const getDiscountsProvidersWrapper = (order: OrderDetailsQuery["order"]) => {
  const mockedCommonDiscountProviderValues = {
    openDialog: () => {},
    closeDialog: () => {},
    isDialogOpen: false,
  };
  const MockOrderDiscountProvider = ({ children }) => {
    const mockedOrderDiscountProviderValues: OrderDiscountContextConsumerProps = {
      ...mockedCommonDiscountProviderValues,
      orderDiscountAddStatus: "default",
      orderDiscountRemoveStatus: "default",
      orderDiscount: null,
      addOrderDiscount: () => {},
      removeOrderDiscount: () => {},
      discountedPrice: order.total.gross,
      undiscountedPrice: order.undiscountedTotal.gross,
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
      totalDiscountedPrice: order.lines[0].totalPrice.gross,
      unitUndiscountedPrice: order.lines[0].undiscountedUnitPrice.gross,
      unitDiscountedPrice: order.lines[0].unitPrice.gross,
    });

    return (
      <OrderLineDiscountContext.Provider value={mockedOrderDiscountProviderValues}>
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
