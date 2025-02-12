import React, { FC } from "react";

import { useDiscountFilterAPIProvider } from "../API/DiscountFiltersAPIProvider";
import { useDraftOrderFilterAPIProvider } from "../API/DraftOrderFilterAPIProvider";
import { useGiftCardsFiltersAPIProvider } from "../API/GiftCardsFilterAPIProvider";
import { useInitialGiftCardsState } from "../API/initialState/giftCards/useInitialGiftCardsState";
import { useInitialOrderState } from "../API/initialState/orders/useInitialOrderState";
import { useInitialPageState } from "../API/initialState/page/useInitialPageState";
import { useProductInitialAPIState } from "../API/initialState/useInitialAPIState";
import { useInitialVouchersState } from "../API/initialState/vouchers/useInitialVouchersState";
import { useOrderFilterAPIProvider } from "../API/OrderFilterAPIProvider";
import { usePageAPIProvider } from "../API/PageFilterAPIProvider";
import { useProductFilterAPIProvider } from "../API/ProductFilterAPIProvider";
import { useVoucherAPIProvider } from "../API/VoucherFilterAPIProvider";
import {
  STATIC_DISCOUNT_OPTIONS,
  STATIC_DRAFT_ORDER_OPTIONS,
  STATIC_GIFT_CARDS_OPTIONS,
  STATIC_ORDER_OPTIONS,
  STATIC_PAGE_OPTIONS,
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

export const ConditionalPageFilterProvider: FC<{
  locationSearch: string;
}> = ({ children, locationSearch }) => {
  const apiProvider = usePageAPIProvider();

  const initialState = useInitialPageState();
  const valueProvider = useUrlValueProvider(locationSearch, "page", initialState);
  const leftOperandsProvider = useFilterLeftOperandsProvider(STATIC_PAGE_OPTIONS);
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

export const ConditionalDraftOrderFilterProvider: FC<{
  locationSearch: string;
}> = ({ children, locationSearch }) => {
  const apiProvider = useDraftOrderFilterAPIProvider();

  const valueProvider = useUrlValueProvider(locationSearch, "draft-order");
  const leftOperandsProvider = useFilterLeftOperandsProvider(STATIC_DRAFT_ORDER_OPTIONS);
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

export const ConditionalGiftCardsFilterProver: FC<{ locationSearch: string }> = ({
  children,
  locationSearch,
}) => {
  const initialState = useInitialGiftCardsState();
  const apiProvider = useGiftCardsFiltersAPIProvider();
  const valueProvider = useUrlValueProvider(locationSearch, "gift-cards", initialState);
  const leftOperandsProvider = useFilterLeftOperandsProvider(STATIC_GIFT_CARDS_OPTIONS);
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
