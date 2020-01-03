import { FilterOpts, MinMax } from "@saleor/types";
import {
  DiscountStatusEnum,
  DiscountValueTypeEnum
} from "@saleor/types/globalTypes";

export interface SaleListFilterOpts {
  saleType: FilterOpts<DiscountValueTypeEnum>;
  started: FilterOpts<MinMax>;
  status: FilterOpts<DiscountStatusEnum[]>;
}

export enum RequirementsPicker {
  ORDER = "ORDER",
  ITEM = "ITEM",
  NONE = "NONE"
}
