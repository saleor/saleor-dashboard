import { SearchCustomersQuery } from "@saleor/graphql";
import { RelayToFlat } from "@saleor/types";

import { CheckIfOrderExists_order } from "../queries/types/CheckIfOrderExists";
import { SearchCatalog } from "../queries/types/SearchCatalog";

export interface ActionQueries {
  catalog: SearchCatalog;
  customers: RelayToFlat<SearchCustomersQuery["search"]>;
  order: CheckIfOrderExists_order;
}
