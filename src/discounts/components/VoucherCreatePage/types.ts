import { CategoryFragment, CollectionFragment, ProductFragment } from "@dashboard/graphql";

import { VoucherDetailsPageFormData } from "../VoucherDetailsPage";

export interface FormData extends VoucherDetailsPageFormData {
  value: number;
  countries: string[];
  categories: Array<CategoryFragment>;
  collections: Array<CollectionFragment>;
  products: Array<ProductFragment>;
  variants: string[];
}
