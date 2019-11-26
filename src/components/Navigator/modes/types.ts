import { SearchCustomers_search_edges_node } from "@saleor/searches/types/SearchCustomers";
import { CheckIfOrderExists_order } from "../queries/types/CheckIfOrderExists";
import { SearchCatalog } from "../queries/types/SearchCatalog";

export interface ActionQueries {
  catalog: SearchCatalog;
  customers: SearchCustomers_search_edges_node[];
  order: CheckIfOrderExists_order;
}
