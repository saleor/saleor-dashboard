import React from "react";

import { ColumnCategory } from "./useColumns";

export const useAvailableColumnsQuery = (currentCategory: ColumnCategory | undefined) => {
  const [query, setQuery] = React.useState<string>("");
  React.useEffect(() => {
    if (currentCategory) {
      setQuery(currentCategory.initialSearch ?? "");
    }
  }, [currentCategory]);

  return { query, setQuery };
};
