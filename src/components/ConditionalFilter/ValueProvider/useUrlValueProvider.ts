/* eslint-disable react-hooks/exhaustive-deps */
import { stringify } from "qs";
import { useEffect, useMemo, useState } from "react";
import { useHistory, useLocation } from "react-router";

import { type InitialAttributesAPIState } from "../API/initialState/attributes/useInitialAttributesState";
import { type InitialCollectionAPIState } from "../API/initialState/collections/useInitialCollectionsState";
import { type InitialCustomerAPIState } from "../API/initialState/customers/useInitialCustomerState";
import { type InitialDiscountAPIState } from "../API/initialState/discounts/useInitialDiscountsState";
import { type InitialGiftCardsAPIState } from "../API/initialState/giftCards/useInitialGiftCardsState";
import { type InitialOrderAPIState } from "../API/initialState/orders/useInitialOrderState";
import { type InitialPageAPIState } from "../API/initialState/page/useInitialPageState";
import { type InitialProductAPIState } from "../API/initialState/product/useProductInitialAPIState";
import { type InitialProductTypesAPIState } from "../API/initialState/productTypes/useInitialProdutTypesState";
import { type InitialStaffMembersAPIState } from "../API/initialState/staffMembers/useInitialStaffMemebersState";
import { type InitialVoucherAPIState } from "../API/initialState/vouchers/useInitialVouchersState";
import {
  cloneFilterContainer,
  type FilterContainer,
  FilterElement,
} from "../FilterElement/FilterElement";
import { type FilterValueProvider } from "../FilterValueProvider";
import { type FilterProviderType, type InitialAPIState } from "../types";
import { getNavigationQueryParams, stripNavigationQueryParams } from "./navigationQueryParams";
import { TokenArray } from "./TokenArray";
import {
  type AttributesFetchingParams,
  type CollectionFetchingParams,
  type CustomerFetchingParams,
  type DiscountFetchingParams,
  type FetchingParams,
  getEmptyFetchingPrams,
  type GiftCardsFetchingParams,
  type OrderFetchingParams,
  type PageFetchingParams,
  type ProductTypesFetchingParams,
  type StaffMembersFetchingParams,
  type VoucherFetchingParams,
} from "./TokenArray/fetchingParams";
import { prepareStructure } from "./utils";

export const useUrlValueProvider = (
  locationSearch: string,
  type: FilterProviderType,
  initialState?: InitialAPIState,
): FilterValueProvider => {
  const history = useHistory();
  const location = useLocation();
  const params = new URLSearchParams(locationSearch);
  const [value, setValue] = useState<FilterContainer>([]);
  const activeTab = params.get("activeTab");
  const query = params.get("query");
  const sort = params.get("sort");
  const asc = params.get("asc");

  params.delete("asc");
  params.delete("sort");
  params.delete("activeTab");
  params.delete("query");
  params.delete("before");
  params.delete("after");
  stripNavigationQueryParams(params, type);

  const tokenizedUrl = useMemo(() => new TokenArray(params.toString()), [params.toString()]);
  const paramsFromType = getEmptyFetchingPrams(type);
  const fetchingParams = paramsFromType
    ? tokenizedUrl.getFetchingParams(paramsFromType, type)
    : null;

  useEffect(() => {
    if (initialState) {
      switch (type) {
        case "product":
          (initialState as InitialProductAPIState).fetchQueries(fetchingParams as FetchingParams);
          break;
        case "order":
          (initialState as InitialOrderAPIState).fetchQueries(
            fetchingParams as OrderFetchingParams,
          );
          break;
        case "voucher":
          (initialState as InitialVoucherAPIState).fetchQueries(
            fetchingParams as VoucherFetchingParams,
          );
          break;
        case "discount":
          (initialState as InitialDiscountAPIState).fetchQueries(
            fetchingParams as DiscountFetchingParams,
          );
          break;
        case "page":
          (initialState as InitialPageAPIState).fetchQueries(fetchingParams as PageFetchingParams);
          break;
        case "customer":
          (initialState as InitialCustomerAPIState).fetchQueries(
            fetchingParams as CustomerFetchingParams,
          );
          break;
        case "gift-cards":
          (initialState as InitialGiftCardsAPIState).fetchQueries(
            fetchingParams as GiftCardsFetchingParams,
          );
          break;
        case "collection":
          (initialState as InitialCollectionAPIState).fetchQueries(
            fetchingParams as CollectionFetchingParams,
          );
          break;
        case "product-types":
          (initialState as InitialProductTypesAPIState).fetchQueries(
            fetchingParams as ProductTypesFetchingParams,
          );
          break;
        case "staff-members":
          (initialState as InitialStaffMembersAPIState).fetchQueries(
            fetchingParams as StaffMembersFetchingParams,
          );
          break;
        case "attributes":
          (initialState as InitialAttributesAPIState).fetchQueries(
            fetchingParams as AttributesFetchingParams,
          );
          break;
      }
    }
  }, [locationSearch]);

  useEffect(() => {
    if (!initialState) return;

    const { data, loading } = initialState;

    if (loading) return;

    setValue(tokenizedUrl.asFilterValuesFromResponse(data));
    // Only run after fetching the initial data; otherwise, a race condition may occur.
  }, [initialState?.data, initialState?.loading]);

  useEffect(() => {
    if (initialState) return;

    setValue(tokenizedUrl.asFilterValueFromEmpty());
  }, [locationSearch, tokenizedUrl, initialState]);

  const persist = (filterValue: FilterContainer) => {
    const navigationParams = getNavigationQueryParams(location.search, type);

    history.replace({
      pathname: location.pathname,
      search: stringify({
        ...prepareStructure(filterValue),
        ...{ activeTab: activeTab || undefined },
        ...{ query: query || undefined },
        ...{ sort: sort || undefined },
        ...{ asc: asc || undefined },
        ...navigationParams,
      }),
    });
    setValue(cloneFilterContainer(filterValue));
  };

  const clear = () => {
    const navigationParams = getNavigationQueryParams(location.search, type);

    history.replace({
      pathname: location.pathname,
      search: stringify({
        ...{ activeTab: activeTab || undefined },
        ...{ sort: sort || undefined },
        ...{ asc: asc || undefined },
        ...navigationParams,
      }),
    });
    setValue([]);
  };

  const isPersisted = (element: FilterElement) => {
    return value.some(p => FilterElement.isFilterElement(p) && p.equals(element));
  };

  const getTokenByName = (name: string) => {
    return tokenizedUrl.asFlatArray().find(token => token.name === name);
  };

  const count = value.filter(v => typeof v !== "string").length;

  return {
    value,
    loading: initialState?.loading || false,
    persist,
    clear,
    isPersisted,
    getTokenByName,
    count,
  };
};
