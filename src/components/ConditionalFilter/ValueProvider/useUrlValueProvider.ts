import { stringify } from "qs";
import { useEffect, useState } from "react";
import useRouter from "use-react-router";

import { InitialAPIState } from "../API";
import { InitialStateResponse } from "../API/InitialStateResponse";
import { FilterContainer, FilterElement } from "../FilterElement";
import { FilterValueProvider } from "../FilterValueProvider";
import { TokenArray } from "./TokenArray";
import { UrlEntry } from "./UrlToken";

type Structure = Array<string | UrlEntry | Structure>;

const prepareStructure = (filterValue: FilterContainer): Structure =>
  filterValue.map(f => {
    if (typeof f === "string") {
      return f;
    }

    if (Array.isArray(f)) {
      return prepareStructure(f);
    }

    return f.asUrlEntry();
  });

export const useUrlValueProvider = (
  locationSearch: string,
  initialState?: InitialAPIState,
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
  const fetchingParams = tokenizedUrl.getFetchingParams();

  useEffect(() => {
    initialState?.fetchQueries(fetchingParams);
  }, [locationSearch]);

  useEffect(() => {
    if (!initialState) return;

    const { data, loading } = initialState;

    if (loading) return;

    setValue(tokenizedUrl.asFilterValuesFromResponse(data));
  }, [initialState?.data, initialState?.loading]);

  useEffect(() => {
    if (initialState) return;

    setValue(
      tokenizedUrl.asFilterValuesFromResponse(InitialStateResponse.empty()),
    );
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
