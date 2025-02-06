import { useInitialVouchersState } from "@dashboard/components/ConditionalFilter/API/initialState/vouchers/useInitialVouchersState";
import { useVoucherAPIProvider } from "@dashboard/components/ConditionalFilter/API/VoucherFilterAPIProvider";
import React, { FC } from "react";

import { useDiscountFilterAPIProvider } from "../API/DiscountFiltersAPIProvider";
import { useInitialOrderState } from "../API/initialState/orders/useInitialOrderState";
import { useProductInitialAPIState } from "../API/initialState/useInitialAPIState";
import { useOrderFilterAPIProvider } from "../API/OrderFilterAPIProvider";
import { useProductFilterAPIProvider } from "../API/ProductFilterAPIProvider";
import {
  STATIC_DISCOUNT_OPTIONS,
  STATIC_ORDER_OPTIONS,
  STATIC_PRODUCT_OPTIONS,
  STATIC_VOUCHER_OPTIONS,
} from "../constants";
import { useContainerState } from "../useContainerState";
import { useFilterLeftOperandsProvider } from "../useFilterLeftOperands";
import { useFilterWindow } from "../useFilterWindow";
import { useUrlValueProvider } from "../ValueProvider/useUrlValueProvider";
import { ConditionalFilterContext } from "./context";

export const ConditionalProductFilterProvider: FC<{
  locationSearch: string;
}> = ({ children, locationSearch }) => {
  const apiProvider = useProductFilterAPIProvider();
  const initialState = useProductInitialAPIState();
  const valueProvider = useUrlValueProvider(locationSearch, "product", initialState);
  const leftOperandsProvider = useFilterLeftOperandsProvider(STATIC_PRODUCT_OPTIONS);
  const containerState = useContainerState(valueProvider);
  const filterWindow = useFilterWindow();

  return (
    <ConditionalFilterContext.Provider
      value={{
        apiProvider,
        valueProvider,
        leftOperandsProvider,
        containerState,
        filterWindow,
      }}
    >
      {children}
    </ConditionalFilterContext.Provider>
  );
};

export const ConditionalDiscountFilterProvider: FC<{
  locationSearch: string;
}> = ({ children, locationSearch }) => {
  const apiProvider = useDiscountFilterAPIProvider();
  const valueProvider = useUrlValueProvider(locationSearch, "discount");
  const leftOperandsProvider = useFilterLeftOperandsProvider(STATIC_DISCOUNT_OPTIONS);
  const containerState = useContainerState(valueProvider);
  const filterWindow = useFilterWindow();

  return (
    <ConditionalFilterContext.Provider
      value={{
        apiProvider,
        valueProvider,
        leftOperandsProvider,
        containerState,
        filterWindow,
      }}
    >
      {children}
    </ConditionalFilterContext.Provider>
  );
};

export const ConditionalOrderFilterProvider: FC<{
  locationSearch: string;
}> = ({ children, locationSearch }) => {
  const apiProvider = useOrderFilterAPIProvider();

  const initialState = useInitialOrderState();
  const valueProvider = useUrlValueProvider(locationSearch, "order", initialState);
  const leftOperandsProvider = useFilterLeftOperandsProvider(STATIC_ORDER_OPTIONS);
  const containerState = useContainerState(valueProvider);
  const filterWindow = useFilterWindow();

  return (
    <ConditionalFilterContext.Provider
      value={{
        apiProvider,
        valueProvider,
        leftOperandsProvider,
        containerState,
        filterWindow,
      }}
    >
      {children}
    </ConditionalFilterContext.Provider>
  );
};

export const ConditionalVoucherFilterProvider: FC<{ locationSearch: string }> = ({
  children,
  locationSearch,
}) => {
  const apiProvider = useVoucherAPIProvider();

  const initialState = useInitialVouchersState();
  const valueProvider = useUrlValueProvider(locationSearch, "voucher", initialState);
  const leftOperandsProvider = useFilterLeftOperandsProvider(STATIC_VOUCHER_OPTIONS);
  const containerState = useContainerState(valueProvider);
  const filterWindow = useFilterWindow();

  return (
    <ConditionalFilterContext.Provider
      value={{
        apiProvider,
        valueProvider,
        leftOperandsProvider,
        containerState,
        filterWindow,
      }}
    >
      {children}
    </ConditionalFilterContext.Provider>
  );
};
