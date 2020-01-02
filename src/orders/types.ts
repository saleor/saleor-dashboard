import { FilterOpts, MinMax } from "@saleor/types";
import { OrderStatusFilter } from "@saleor/types/globalTypes";

export interface OrderListFilterOpts {
  created: FilterOpts<MinMax>;
  status: FilterOpts<OrderStatusFilter[]>;
}

export interface OrderDraftListFilterOpts {
  created: FilterOpts<MinMax>;
  customer: FilterOpts<string>;
}
