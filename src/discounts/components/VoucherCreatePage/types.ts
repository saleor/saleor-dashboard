import {
  CategoryWithTotalProductsFragment,
  CollectionWithTotalProductsFragment,
  CountryWithCodeFragment,
  ProductFragment,
} from "@dashboard/graphql";

import { VoucherDetailsPageFormData } from "../VoucherDetailsPage";

export interface FormData extends VoucherDetailsPageFormData {
  value: number;
  countries: Array<CountryWithCodeFragment>;
  categories: Array<CategoryWithTotalProductsFragment>;
  collections: Array<CollectionWithTotalProductsFragment>;
  products: Array<ProductFragment>;
}
