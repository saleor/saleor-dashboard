import {
  VoucherDiscountType,
  DiscountStatusEnum
} from "@saleor/types/globalTypes";
import { MinMax, FilterOpts } from "@saleor/types";

export interface VoucherListFilterOpts {
  saleType: FilterOpts<VoucherDiscountType[]>;
  started: FilterOpts<MinMax>;
  status: FilterOpts<DiscountStatusEnum[]>;
  timesUsed: FilterOpts<MinMax>;
}

export enum RequirementsPicker {
  ORDER = "ORDER",
  ITEM = "ITEM",
  NONE = "NONE"
}
