import React from "react";

const parseQuery = (query: string) =>
  query.replace(/([.?*+\-=:^$\\[\]<>(){}|])/g, "\\$&");

export function useLocalSearch<T>(
  array: T[] | undefined,
  getStringToSearch: (element: T) => string
) {
  const [query, setQuery] = React.useState("");
  const searchResult = React.useMemo(
    () =>
      array?.filter(
        element =>
          getStringToSearch(element).search(
            new RegExp(parseQuery(query), "i")
          ) >= 0
      ),
    [array, query]
  );
  return { query, setQuery, searchResult };
}
