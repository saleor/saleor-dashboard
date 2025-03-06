import {
  CategoryFragment,
  CollectionFragment,
  CountryWithCodeFragment,
  ProductFragment,
} from "@dashboard/graphql";

import { VoucherDetailsPageFormData } from "../VoucherDetailsPage";

export interface FormData extends VoucherDetailsPageFormData {
  value: number;
  countries: Array<CountryWithCodeFragment>;
  categories: Array<CategoryFragment>;
  collections: Array<CollectionFragment>;
  products: Array<ProductFragment>;
}
