import {
  SearchOrdersByNumberQuery,
  SearchOrdersByNumberQueryHookResult,
  useSearchOrdersByNumberQuery,
} from "@dashboard/graphql";
import useDebounce from "@dashboard/hooks/useDebounce";
import { useState } from "react";

type OrderNode = NonNullable<SearchOrdersByNumberQuery["orders"]>["edges"][0]["node"];
export type QuickOrderSearchResult = OrderNode[];

export function useQuickOrderSearch(): [
  SearchOrdersByNumberQueryHookResult,
  (query: string) => void,
] {
  const [query, setQuery] = useState<string>("");
  const setQueryDebounced = useDebounce(setQuery);

  const result = useSearchOrdersByNumberQuery({
    skip: query === "",
    variables: {
      first: 10,
      query,
    },
  });

  return [result, setQueryDebounced];
}
