import { FilterOpts, MinMax } from "@saleor/types";
import {
  DiscountStatusEnum,
  DiscountValueTypeEnum,
  VoucherDiscountType
} from "@saleor/types/globalTypes";

export interface SaleListFilterOpts {
  saleType: FilterOpts<DiscountValueTypeEnum>;
  started: FilterOpts<MinMax>;
  status: FilterOpts<DiscountStatusEnum[]>;
}

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
