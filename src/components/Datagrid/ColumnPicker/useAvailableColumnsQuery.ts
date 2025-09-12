import { useEffect, useState } from "react";

import { ColumnCategory } from "./useColumns";

export const useAvailableColumnsQuery = (currentCategory: ColumnCategory | undefined) => {
  const [query, setQuery] = useState<string>("");

  useEffect(() => {
    if (currentCategory) {
      setQuery(currentCategory.initialSearch ?? "");
    }
  }, [currentCategory]);

  return { query, setQuery };
};
