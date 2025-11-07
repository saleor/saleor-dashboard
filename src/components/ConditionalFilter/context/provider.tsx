import { FC, ReactNode } from "react";

import { useInitialAttributesState } from "../API/initialState/attributes/useInitialAttributesState";
import { useInitialCollectionState } from "../API/initialState/collections/useInitialCollectionsState";
import { useInitialGiftCardsState } from "../API/initialState/giftCards/useInitialGiftCardsState";
import { useInitialOrderState } from "../API/initialState/orders/useInitialOrderState";
import { useInitialPageState } from "../API/initialState/page/useInitialPageState";
import { useProductInitialAPIState } from "../API/initialState/product/useProductInitialAPIState";
import { useInitialProductTypesState } from "../API/initialState/productTypes/useInitialProdutTypesState";
import { useInitialStaffMembersState } from "../API/initialState/staffMembers/useInitialStaffMemebersState";
import { useInitialVouchersState } from "../API/initialState/vouchers/useInitialVouchersState";
import { useAttributesFilterAPIProvider } from "../API/providers/AttributesFilterAPIProvider";
import { useCollectionFilterAPIProvider } from "../API/providers/CollectionFilterAPIProvider";
import { useCustomerAPIProvider } from "../API/providers/CustomerFilterAPIProvider";
import { useDiscountFilterAPIProvider } from "../API/providers/DiscountFiltersAPIProvider";
import { useDraftOrderFilterAPIProvider } from "../API/providers/DraftOrderFilterAPIProvider";
import { useGiftCardsFiltersAPIProvider } from "../API/providers/GiftCardsFilterAPIProvider";
import { useOrderFilterAPIProvider } from "../API/providers/OrderFilterAPIProvider";
import { usePageAPIProvider } from "../API/providers/PageFilterAPIProvider";
import { useProductFilterAPIProvider } from "../API/providers/ProductFilterAPIProvider";
import { useProductTypesFilterAPIProvider } from "../API/providers/ProductTypesFilterAPIProvider";
import { useStaffMembersFilterAPIProvider } from "../API/providers/StaffMembersFilterAPIProvider";
import { useVoucherAPIProvider } from "../API/providers/VoucherFilterAPIProvider";
import {
  STAFF_MEMBER_OPTIONS,
  STATIC_ATTRIBUTES_OPTIONS,
  STATIC_COLLECTION_OPTIONS,
  STATIC_CUSTOMER_OPTIONS,
  STATIC_DISCOUNT_OPTIONS,
  STATIC_DRAFT_ORDER_OPTIONS,
  STATIC_GIFT_CARDS_OPTIONS,
  STATIC_ORDER_OPTIONS,
  STATIC_PAGE_OPTIONS,
  STATIC_PRODUCT_OPTIONS,
  STATIC_PRODUCT_TYPES_OPTIONS,
  STATIC_VOUCHER_OPTIONS,
} from "../constants";
import { QUERY_API_TYPES } from "../queryVariables";
import { useContainerState } from "../useContainerState";
import { useFilterLeftOperandsProvider } from "../useFilterLeftOperands";
import { useFilterWindow } from "../useFilterWindow";
import { useUrlValueProvider } from "../ValueProvider/useUrlValueProvider";
import { ConditionalFilterContext } from "./context";

export const ConditionalProductFilterProvider: FC<{
  locationSearch: string;
  children: ReactNode;
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
        queryApiType: QUERY_API_TYPES.PRODUCT,
      }}
    >
      {children}
    </ConditionalFilterContext.Provider>
  );
};

export const ConditionalDiscountFilterProvider: FC<{
  locationSearch: string;
  children: ReactNode;
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
        queryApiType: QUERY_API_TYPES.DISCOUNT,
      }}
    >
      {children}
    </ConditionalFilterContext.Provider>
  );
};

export const ConditionalOrderFilterProvider: FC<{
  locationSearch: string;
  children: ReactNode;
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
        queryApiType: QUERY_API_TYPES.ORDER,
      }}
    >
      {children}
    </ConditionalFilterContext.Provider>
  );
};

export const ConditionalVoucherFilterProvider: FC<{
  locationSearch: string;
  children: ReactNode;
}> = ({ children, locationSearch }) => {
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
        queryApiType: QUERY_API_TYPES.VOUCHER,
      }}
    >
      {children}
    </ConditionalFilterContext.Provider>
  );
};

export const ConditionalPageFilterProvider: FC<{
  locationSearch: string;
  children: ReactNode;
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
        queryApiType: QUERY_API_TYPES.PAGE,
      }}
    >
      {children}
    </ConditionalFilterContext.Provider>
  );
};

export const ConditionalDraftOrderFilterProvider: FC<{
  locationSearch: string;
  children: ReactNode;
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
        queryApiType: QUERY_API_TYPES.DRAFT_ORDER,
      }}
    >
      {children}
    </ConditionalFilterContext.Provider>
  );
};

export const ConditionalGiftCardsFilterProver: FC<{
  locationSearch: string;
  children: ReactNode;
}> = ({ children, locationSearch }) => {
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
        queryApiType: QUERY_API_TYPES.GIFT_CARD,
      }}
    >
      {children}
    </ConditionalFilterContext.Provider>
  );
};

export const ConditionalCustomerFilterProvider: FC<{
  locationSearch: string;
  children: ReactNode;
}> = ({ children, locationSearch }) => {
  const apiProvider = useCustomerAPIProvider();

  const valueProvider = useUrlValueProvider(locationSearch, "customer");
  const leftOperandsProvider = useFilterLeftOperandsProvider(STATIC_CUSTOMER_OPTIONS);
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
        queryApiType: QUERY_API_TYPES.CUSTOMER,
      }}
    >
      {children}
    </ConditionalFilterContext.Provider>
  );
};

export const ConditionalCollectionFilterProvider: FC<{
  locationSearch: string;
  children: ReactNode;
}> = ({ children, locationSearch }) => {
  const apiProvider = useCollectionFilterAPIProvider();

  const initialState = useInitialCollectionState();

  const valueProvider = useUrlValueProvider(locationSearch, "collection", initialState);
  const leftOperandsProvider = useFilterLeftOperandsProvider(STATIC_COLLECTION_OPTIONS);
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
        queryApiType: QUERY_API_TYPES.COLLECTION,
      }}
    >
      {children}
    </ConditionalFilterContext.Provider>
  );
};

export const ConditionalProductTypesFilterProvider: FC<{
  locationSearch: string;
  children: ReactNode;
}> = ({ children, locationSearch }) => {
  const apiProvider = useProductTypesFilterAPIProvider();

  const initialState = useInitialProductTypesState();
  const valueProvider = useUrlValueProvider(locationSearch, "product-types", initialState);
  const leftOperandsProvider = useFilterLeftOperandsProvider(STATIC_PRODUCT_TYPES_OPTIONS);
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
        queryApiType: QUERY_API_TYPES.PRODUCT_TYPE,
      }}
    >
      {children}
    </ConditionalFilterContext.Provider>
  );
};

export const ConditionalStaffMembersFilterProvider: FC<{
  locationSearch: string;
  children: ReactNode;
}> = ({ children, locationSearch }) => {
  const apiProvider = useStaffMembersFilterAPIProvider();

  const initialState = useInitialStaffMembersState();
  const valueProvider = useUrlValueProvider(locationSearch, "staff-members", initialState);
  const leftOperandsProvider = useFilterLeftOperandsProvider(STAFF_MEMBER_OPTIONS);
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
        queryApiType: QUERY_API_TYPES.STAFF_MEMBER,
      }}
    >
      {children}
    </ConditionalFilterContext.Provider>
  );
};

export const ConditionalAttributesFilterProvider: FC<{
  locationSearch: string;
  children: ReactNode;
}> = ({ children, locationSearch }) => {
  const apiProvider = useAttributesFilterAPIProvider();

  const initialState = useInitialAttributesState();
  const valueProvider = useUrlValueProvider(locationSearch, "attributes", initialState);
  const leftOperandsProvider = useFilterLeftOperandsProvider(STATIC_ATTRIBUTES_OPTIONS);
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
        queryApiType: QUERY_API_TYPES.ATTRIBUTE,
      }}
    >
      {children}
    </ConditionalFilterContext.Provider>
  );
};
