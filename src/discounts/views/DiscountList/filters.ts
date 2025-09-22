import { createFilterTabUtils } from "@dashboard/utils/filters";

const DISCOUNT_FILTERS_KEY = "saleFilters";

export const storageUtils = createFilterTabUtils<string>(DISCOUNT_FILTERS_KEY);
