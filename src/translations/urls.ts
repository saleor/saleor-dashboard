import { Pagination } from "@saleor/types";
import { stringifyQs } from "@saleor/utils/urls";
import urlJoin from "url-join";

import { TranslationsEntitiesListFilterTab } from "./components/TranslationsEntitiesListPage";

export enum TranslatableEntities {
  categories = "categories",
  products = "products",
  productVariants = "variants",
  collections = "collections",
  sales = "sales",
  vouchers = "vouchers",
  pages = "pages",
  attributes = "attributes",
  shippingMethods = "shippingMethods",
  menuItems = "menuItems",
}

const translationsSection = "/translations/";

export const languageListPath = translationsSection;
export const languageListUrl = translationsSection;

export const languageEntitiesPath = (code: string) =>
  urlJoin(translationsSection, code);
export type LanguageEntitiesUrlQueryParams = Pagination &
  Partial<{
    query: string;
    tab: TranslationsEntitiesListFilterTab;
  }>;
export const languageEntitiesUrl = (
  code: string,
  params: LanguageEntitiesUrlQueryParams,
) => languageEntitiesPath(code) + "?" + stringifyQs(params);

export const languageEntityPath = (
  code: string,
  entity: TranslatableEntities,
  id: string,
  ...args: string[]
) => urlJoin(languageEntitiesPath(code), entity.toString(), id, ...args);
export const languageEntityUrl = (
  code: string,
  entity: TranslatableEntities,
  id: string,
  ...args: string[]
) => languageEntityPath(code, entity, encodeURIComponent(id), ...args);

export const productVariantUrl = (
  code: string,
  productId: string,
  variantId: string,
) =>
  languageEntityUrl(
    code,
    TranslatableEntities.products,
    productId,
    TranslatableEntities.productVariants,
    variantId,
  );
