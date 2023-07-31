import { stringify } from "qs";
import { useEffect, useState } from "react";
import useRouter from "use-react-router";

import { InitialAPIState } from "../API";
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
  initialState: InitialAPIState,
  locationSearch: string,
): FilterValueProvider => {
  const router = useRouter();
  const params = new URLSearchParams(locationSearch);
  const { data, loading, fetchQueries } = initialState;
  const [value, setValue] = useState<FilterContainer>([]);

  const activeTab = params.get("activeTab");
  params.delete("asc");
  params.delete("sort");
  params.delete("activeTab");

  const tokenizedUrl = new TokenArray(params.toString());
  const fetchingParams = tokenizedUrl.getFetchingParams();

  useEffect(() => {
    fetchQueries(fetchingParams);
  }, [locationSearch]);

  useEffect(() => {
    if (loading) return;

    setValue(tokenizedUrl.asFilterValuesFromResponse(data));
  }, [data, loading]);

  const persist = (filterValue: FilterContainer) => {
    router.history.replace({
      pathname: router.location.pathname,
      search: stringify({
        ...prepareStructure(filterValue),
        ...{ activeTab: activeTab || undefined },
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

  const count = value.filter(v => typeof v !== "string").length;

  return {
    value,
    loading,
    persist,
    clear,
    isPersisted,
    count,
  };
};
