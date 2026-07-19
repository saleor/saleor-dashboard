import {
  type CategoryWithTotalProductsFragment,
  type CollectionWithTotalProductsFragment,
  type CountryWithCodeFragment,
  type SearchProductFragment,
  type SearchProductVariantFragment,
} from "@dashboard/graphql";

import { type VoucherDetailsPageFormData } from "../VoucherDetailsPage";

export type VoucherCreateProductVariant = SearchProductVariantFragment;

export interface FormData extends VoucherDetailsPageFormData {
  value: number;
  countries: Array<CountryWithCodeFragment>;
  categories: Array<CategoryWithTotalProductsFragment>;
  collections: Array<CollectionWithTotalProductsFragment>;
  products: Array<SearchProductFragment>;
  variants: Array<VoucherCreateProductVariant>;
}

export enum VoucherCreatePageTab {
  categories = "categories",
  collections = "collections",
  products = "products",
  variants = "variants",
}
