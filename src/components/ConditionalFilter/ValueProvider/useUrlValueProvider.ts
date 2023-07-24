import { stringify } from "qs";
import { useEffect, useState } from "react";
import useRouter from "use-react-router";

import { InitialAPIState } from "../API";
import { FilterContainer } from "../FilterElement";
import { FilterValueProvider } from "../FilterValueProvider";
import { useTokenArray } from "./TokenArray";
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
): FilterValueProvider => {
  const router = useRouter();
  const params = new URLSearchParams(router.location.search);
  const { data, loading, fetchQueries } = initialState;
  const [value, setValue] = useState<FilterContainer>([]);

  params.delete("asc");
  params.delete("sort");

  const tokenizedUrl = useTokenArray(params.toString());
  const fetchingParams = tokenizedUrl.getFetchingParams();
  useEffect(() => {
    fetchQueries(fetchingParams);
  }, []);

  useEffect(() => {
    if (loading) return

    setValue(tokenizedUrl.asFilterValuesFromResponse(data));
  }, [data, loading]);

  const persist = (filterValue: FilterContainer) => {
    router.history.replace({
      pathname: router.location.pathname,
      search: stringify(prepareStructure(filterValue)),
    });
    setValue(filterValue);
  };

  const clear = () => {
    router.history.replace({
      pathname: router.location.pathname,
    });
    setValue([]);
  };

  return {
    value,
    loading,
    persist,
    clear,
  };
};
