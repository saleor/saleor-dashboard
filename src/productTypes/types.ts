import { FilterOpts } from "@saleor/types";
import {
  ProductTypeConfigurable,
  ProductTypeEnum
} from "@saleor/types/globalTypes";

export interface ProductTypeListFilterOpts {
  configurable: FilterOpts<ProductTypeConfigurable>;
  type: FilterOpts<ProductTypeEnum>;
}
