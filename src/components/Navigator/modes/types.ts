import { SearchCustomers_search_edges_node } from "@saleor/searches/types/SearchCustomers";
import { CheckIfOrderExists_order } from "../queries/types/CheckIfOrderExists";

export interface ActionQueries {
  customers: SearchCustomers_search_edges_node[];
  order: CheckIfOrderExists_order;
}
