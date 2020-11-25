import { Pagination } from "@saleor/types";
import { stringify as stringifyQs } from "qs";
import urlJoin from "url-join";

import { TranslationsEntitiesListFilterTab } from "./components/TranslationsEntitiesListPage";

export enum TranslatableEntities {
  categories = "categories",
  products = "products",
  collections = "collections",
  sales = "sales",
  vouchers = "vouchers",
  pages = "pages",
  productTypes = "productTypes",
  shippingMethods = "shippingMethods"
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
  params: LanguageEntitiesUrlQueryParams
) => languageEntitiesPath(code) + "?" + stringifyQs(params);

export const languageEntityPath = (
  code: string,
  entity: TranslatableEntities,
  id: string
) => urlJoin(languageEntitiesPath(code), entity.toString(), id);
export const languageEntityUrl = (
  code: string,
  entity: TranslatableEntities,
  id: string
) => languageEntityPath(code, entity, encodeURIComponent(id));
