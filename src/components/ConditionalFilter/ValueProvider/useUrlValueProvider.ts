import { stringify } from "qs";
import useRouter from "use-react-router";

import { FilterAPIProvider } from "../API/FilterAPIProvider";
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
  apiProvider: FilterAPIProvider,
): FilterValueProvider => {
  const router = useRouter();
  const params = new URLSearchParams(router.location.search);
  params.delete("asc");
  params.delete("sort");

  const tokenizedUrl = useTokenArray(params.toString());
  const fetchingParams = tokenizedUrl.getFetchingParams();
  const { data, loading } = apiProvider.useInitialState(fetchingParams);
  const value = loading ? [] : tokenizedUrl.asFilterValuesFromResponse(data);

  const persist = (filterValue: FilterContainer) => {
    router.history.replace({
      pathname: router.location.pathname,
      search: stringify(prepareStructure(filterValue)),
    });
  };

  return {
    value,
    loading,
    persist,
  };
};
