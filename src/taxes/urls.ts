import { Dialog } from "@dashboard/types";
import { stringifyQs } from "@dashboard/utils/urls";
import urlJoin from "url-join";

import { encodeURIComponentOptional } from "./utils/utils";

export type TaxTab = "channels" | "countries" | "tax-classes";

export const taxSection = "/taxes/";
export const taxTabPath = (tab: TaxTab) => urlJoin(taxSection, tab);

export type TaxesUrlDialog = "add-country";
export type TaxesUrlQueryParams = Dialog<TaxesUrlDialog>;

export const taxConfigurationListPath = (id?: string) =>
  id ? urlJoin(taxTabPath("channels"), id) : taxTabPath("channels");

export const taxConfigurationListUrl = (id?: string, params?: TaxesUrlQueryParams) =>
  taxConfigurationListPath(encodeURIComponentOptional(id)) + "?" + stringifyQs(params);

export const taxCountriesListPath = (id?: string) =>
  id ? urlJoin(taxTabPath("countries"), id) : taxTabPath("countries");

export const taxCountriesListUrl = (id?: string, params?: TaxesUrlQueryParams) =>
  taxCountriesListPath(encodeURIComponentOptional(id)) + "?" + stringifyQs(params);

export const taxClassesListUrl = (id?: string) =>
  id ? urlJoin(taxTabPath("tax-classes"), id) : taxTabPath("tax-classes");
