import { createFilterTabUtils } from "@dashboard/utils/filters";

export const DISCOUNT_FILTERS_KEY = "saleFilters";

export const storageUtils = createFilterTabUtils<string>(DISCOUNT_FILTERS_KEY);
