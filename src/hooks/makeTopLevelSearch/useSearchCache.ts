import { mapEdgesToItems } from "@dashboard/utils/maps";
import uniqBy from "lodash/uniqBy";
import React from "react";

import { SearchData } from "./makeTopLevelSearch";

export function useSearchCache<T>(data: SearchData<T> | undefined): T[] {
  const [searchCache, setSearchCache] = React.useState<T[]>([]);

  React.useEffect(() => {
    if (data !== undefined) {
      setSearchCache(prevCache =>
        uniqBy([...prevCache, ...(mapEdgesToItems(data.search) as T[])], "id"),
      );
    }
  }, [data]);
  return searchCache;
}
