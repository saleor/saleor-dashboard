import { useState, useMemo } from "react";

/**
 * This function removes characters which break
 * regexps but are rarely useful in searches
 */
const parseQuery = (query: string) => query.replace(/([.?*+\-=:^$\\[\]<>(){}|])/g, "\\$&");

/**
 * useLocalSearch is a hook that is useful when client-side
 * search is used on particular array of items.
 *
 * @param array Array to search through
 * @param getStringToSearch Function which specifies object
 * property (possibly nested) on which search is used, eg:
 * (element) => element.name where name is a string
 * @returns query, setQuery - useState result
 * searchResult - filtered array
 */
export function useLocalSearch<T>(
  array: T[] | undefined,
  getStringToSearch: (element: T) => string,
) {
  const [query, setQuery] = useState("");
  const searchResult = useMemo(
    () =>
      array?.filter(
        element => getStringToSearch(element).search(new RegExp(parseQuery(query), "i")) >= 0,
      ),
    [array, query],
  );

  return { query, setQuery, searchResult };
}
