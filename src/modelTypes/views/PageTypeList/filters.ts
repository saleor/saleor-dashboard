import { PageTypeFilterInput } from "@dashboard/graphql";

import { createFilterTabUtils, createFilterUtils } from "../../../utils/filters";
import {
  PageTypeListUrlFilters,
  PageTypeListUrlFiltersEnum,
  PageTypeListUrlQueryParams,
} from "../../urls";

const PAGE_TYPE_FILTERS_KEY = "pageTypeFilters";

export function getFilterVariables(params: PageTypeListUrlFilters): PageTypeFilterInput {
  return {
    search: params.query,
  };
}

export const storageUtils = createFilterTabUtils<string>(PAGE_TYPE_FILTERS_KEY);
