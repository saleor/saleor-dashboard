import {
  FilterContainer,
  FilterElement,
} from "@dashboard/components/ConditionalFilter/FilterElement";
import { FilterValueProvider } from "@dashboard/components/ConditionalFilter/FilterValueProvider";
import { TokenArray } from "@dashboard/components/ConditionalFilter/ValueProvider/TokenArray";
import { UrlEntry } from "@dashboard/components/ConditionalFilter/ValueProvider/UrlToken";
import { stringify } from "qs";
import { useState } from "react";
import useRouter from "use-react-router";

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
    loading: false,
    persist,
    clear,
    isPersisted,
    getTokenByName,
    count,
  };
};
