// @ts-strict-ignore
import { SearchCatalogQuery, SearchCustomersQuery } from "@dashboard/graphql";
import { RelayToFlat } from "@dashboard/types";

import { QuickOrderSearchResult } from "../queries/useQuickOrderSearch";

export interface ActionQueries {
  catalog: SearchCatalogQuery;
  customers: RelayToFlat<SearchCustomersQuery["search"]>;
  orders: QuickOrderSearchResult;
}
