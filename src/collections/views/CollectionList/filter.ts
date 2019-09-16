import { CollectionFilterInput } from "@saleor/types/globalTypes";
import {
  createFilterTabUtils,
  createFilterUtils
} from "../../../utils/filters";
import {
  CollectionListUrlFilters,
  CollectionListUrlFiltersEnum,
  CollectionListUrlQueryParams
} from "../../urls";

export const COLLECTION_FILTERS_KEY = "collectionFilters";

export function getFilterVariables(
  params: CollectionListUrlFilters
): CollectionFilterInput {
  return {
    search: params.query
  };
}

export const {
  deleteFilterTab,
  getFilterTabs,
  saveFilterTab
} = createFilterTabUtils<CollectionListUrlFilters>(COLLECTION_FILTERS_KEY);

export const { areFiltersApplied, getActiveFilters } = createFilterUtils<
  CollectionListUrlQueryParams,
  CollectionListUrlFilters
>(CollectionListUrlFiltersEnum);
