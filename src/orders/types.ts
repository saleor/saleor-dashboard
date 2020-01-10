import { FilterOpts, MinMax } from "@saleor/types";

export interface OrderDraftListFilterOpts {
  created: FilterOpts<MinMax>;
  customer: FilterOpts<string>;
}
