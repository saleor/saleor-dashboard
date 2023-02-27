// @ts-strict-ignore
import {
  CheckIfOrderExistsQuery,
  SearchCatalogQuery,
  SearchCustomersQuery,
} from "@dashboard/graphql";
import { RelayToFlat } from "@dashboard/types";

export interface ActionQueries {
  catalog: SearchCatalogQuery;
  customers: RelayToFlat<SearchCustomersQuery["search"]>;
  order: CheckIfOrderExistsQuery["order"];
}
