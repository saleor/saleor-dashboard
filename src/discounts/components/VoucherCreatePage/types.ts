import {
  CategoryWithTotalProductsFragment,
  CollectionWithTotalProductsFragment,
  CountryWithCodeFragment,
  SearchProductFragment,
} from "@dashboard/graphql";

import { VoucherDetailsPageFormData } from "../VoucherDetailsPage";

export interface FormData extends VoucherDetailsPageFormData {
  value: number;
  countries: Array<CountryWithCodeFragment>;
  categories: Array<CategoryWithTotalProductsFragment>;
  collections: Array<CollectionWithTotalProductsFragment>;
  products: Array<SearchProductFragment>;
}

export enum VoucherCreatePageTab {
  categories = "categories",
  collections = "collections",
  products = "products",
}
