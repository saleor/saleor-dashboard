import { FilterOpts, MinMax } from "@saleor/types";
import { StockAvailability } from "@saleor/types/globalTypes";

export enum ProductStatus {
  PUBLISHED = "published",
  HIDDEN = "hidden"
}

export interface ProductListFilterOpts {
  price: FilterOpts<MinMax>;
  status: FilterOpts<ProductStatus>;
  stockStatus: FilterOpts<StockAvailability>;
}
