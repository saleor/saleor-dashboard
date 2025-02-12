/* eslint-disable react-hooks/exhaustive-deps */
import { stringify } from "qs";
import { useEffect, useState } from "react";
import useRouter from "use-react-router";

import { InitialAPIState } from "../API";
import { InitialGiftCardsAPIState } from "../API/initialState/giftCards/useInitialGiftCardsState";
import { InitialOrderAPIState } from "../API/initialState/orders/useInitialOrderState";
import { InitialPageAPIState } from "../API/initialState/page/useInitialPageState";
import { InitialVoucherAPIState } from "../API/initialState/vouchers/useInitialVouchersState";
import { FilterContainer, FilterElement } from "../FilterElement";
import { FilterValueProvider } from "../FilterValueProvider";
import { TokenArray } from "./TokenArray";
import {
  FetchingParams,
  getFetchingPrams,
  GiftCardsFetchingParams,
  OrderFetchingParams,
  PageFetchingParams,
  VoucherFetchingParams,
} from "./TokenArray/fetchingParams";
import { prepareStructure } from "./utils";

export const useUrlValueProvider = (
  locationSearch: string,
  type: "product" | "order" | "discount" | "voucher" | "page" | "draft-order" | "gift-cards",
  initialState?:
    | InitialAPIState
    | InitialOrderAPIState
    | InitialVoucherAPIState
    | InitialPageAPIState
    | InitialGiftCardsAPIState,
): FilterValueProvider => {
  const router = useRouter();
  const params = new URLSearchParams(locationSearch);
  const [value, setValue] = useState<FilterContainer>([]);
  const activeTab = params.get("activeTab");
  const query = params.get("query");
  const before = params.get("before");
  const after = params.get("after");

  params.delete("asc");
  params.delete("sort");
  params.delete("activeTab");
  params.delete("query");
  params.delete("before");
  params.delete("after");

  const tokenizedUrl = new TokenArray(params.toString());
  const paramsFromType = getFetchingPrams(type);
  const fetchingParams = paramsFromType ? tokenizedUrl.getFetchingParams(paramsFromType) : null;

  useEffect(() => {
    if (initialState) {
      switch (type) {
        case "product":
          (initialState as InitialAPIState).fetchQueries(fetchingParams as FetchingParams);
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
        case "page":
          (initialState as InitialPageAPIState).fetchQueries(fetchingParams as PageFetchingParams);
          break;
        case "gift-cards":
          (initialState as InitialGiftCardsAPIState).fetchQueries(
            fetchingParams as GiftCardsFetchingParams,
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
  }, [initialState?.data, initialState?.loading]);

  useEffect(() => {
    if (initialState) return;

    setValue(tokenizedUrl.asFilterValueFromEmpty());
  }, [locationSearch]);

  const persist = (filterValue: FilterContainer) => {
    router.history.replace({
      pathname: router.location.pathname,
      search: stringify({
        ...prepareStructure(filterValue),
        ...{ activeTab: activeTab || undefined },
        ...{ query: query || undefined },
        ...{ before: before || undefined },
        ...{ after: after || undefined },
      }),
    });
    setValue(filterValue);
  };

  const clear = () => {
    router.history.replace({
      pathname: router.location.pathname,
    });
    setValue([]);
  };

  const isPersisted = (element: FilterElement) => {
    return value.some(p => FilterElement.isCompatible(p) && p.equals(element));
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
