import {
  CheckIfOrderExistsQuery,
  SearchCatalogQuery,
  SearchCustomersQuery,
} from "@saleor/graphql";
import { RelayToFlat } from "@saleor/types";

export interface ActionQueries {
  catalog: SearchCatalogQuery;
  customers: RelayToFlat<SearchCustomersQuery["search"]>;
  order: CheckIfOrderExistsQuery["order"];
}
