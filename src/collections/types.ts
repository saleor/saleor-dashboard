import { FilterOpts } from "@saleor/types";
import { CollectionPublished } from "@saleor/types/globalTypes";

export interface CollectionListFilterOpts {
  status: FilterOpts<CollectionPublished>;
}
