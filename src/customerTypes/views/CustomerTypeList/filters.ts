import { createFilterTabUtils } from "../../../utils/filters";
import { type CustomerTypeListUrlFilters } from "../../urls";

const CUSTOMER_TYPE_FILTERS_KEY = "customerTypeFilters";

export function getFilterSearch(params: CustomerTypeListUrlFilters): string | undefined {
  return params.query;
}

export const storageUtils = createFilterTabUtils<string>(CUSTOMER_TYPE_FILTERS_KEY);
