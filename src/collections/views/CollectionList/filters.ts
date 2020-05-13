import {
  CollectionFilterKeys,
  CollectionListFilterOpts
} from "@saleor/collections/components/CollectionListPage";
import { IFilterElement } from "@saleor/components/Filter";
import { findValueInEnum, maybe } from "@saleor/misc";
import {
  CollectionFilterInput,
  CollectionPublished
} from "@saleor/types/globalTypes";

import {
  createFilterTabUtils,
  createFilterUtils,
  getSingleEnumValueQueryParam
} from "../../../utils/filters";
import {
  CollectionListUrlFilters,
  CollectionListUrlFiltersEnum,
  CollectionListUrlQueryParams
} from "../../urls";

export const COLLECTION_FILTERS_KEY = "collectionFilters";

export function getFilterOpts(
  params: CollectionListUrlFilters
): CollectionListFilterOpts {
  return {
    status: {
      active: maybe(() => params.status !== undefined, false),
      value: maybe(() => findValueInEnum(status, CollectionPublished))
    }
  };
}

export function getFilterVariables(
  params: CollectionListUrlFilters
): CollectionFilterInput {
  return {
    published: params.status
      ? findValueInEnum(params.status, CollectionPublished)
      : undefined,
    search: params.query
  };
}

export function getFilterQueryParam(
  filter: IFilterElement<CollectionFilterKeys>
): CollectionListUrlFilters {
  const { name } = filter;

  switch (name) {
    case CollectionFilterKeys.status:
      return getSingleEnumValueQueryParam(
        filter,
        CollectionListUrlFiltersEnum.status,
        CollectionPublished
      );
  }
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
