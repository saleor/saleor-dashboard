// @ts-strict-ignore
import {
  CollectionFilterKeys,
  CollectionListFilterOpts,
} from "@dashboard/collections/components/CollectionListPage";
import { FilterElement, FilterElementRegular } from "@dashboard/components/Filter";
import { SingleAutocompleteChoiceType } from "@dashboard/components/SingleAutocompleteSelectField";
import { CollectionFilterInput, CollectionPublished } from "@dashboard/graphql";
import { findValueInEnum, maybe } from "@dashboard/misc";

import {
  createFilterTabUtils,
  createFilterUtils,
  getSingleEnumValueQueryParam,
  getSingleValueQueryParam,
} from "../../../utils/filters";
import {
  CollectionListUrlFilters,
  CollectionListUrlFiltersEnum,
  CollectionListUrlQueryParams,
} from "../../urls";

export const COLLECTION_FILTERS_KEY = "collectionFilters";

export function getFilterOpts(
  params: CollectionListUrlFilters,
  channels: SingleAutocompleteChoiceType[],
): CollectionListFilterOpts {
  return {
    channel: {
      active: params?.channel !== undefined,
      choices: channels,
      value: params?.channel,
    },
    status: {
      active: maybe(() => params.status !== undefined, false),
      value: maybe(() => findValueInEnum(status, CollectionPublished)),
    },
  };
}

export function getFilterVariables(params: CollectionListUrlFilters): CollectionFilterInput {
  return {
    published: params.status ? findValueInEnum(params.status, CollectionPublished) : undefined,
    search: params.query,
  };
}

export function getFilterQueryParam(
  filter: FilterElement<CollectionFilterKeys>,
): CollectionListUrlFilters {
  const { name } = filter;

  switch (name) {
    case CollectionFilterKeys.status:
      return getSingleEnumValueQueryParam(
        filter as FilterElementRegular<CollectionFilterKeys.status>,
        CollectionListUrlFiltersEnum.status,
        CollectionPublished,
      );
    case CollectionFilterKeys.channel:
      return getSingleValueQueryParam(filter, CollectionListUrlFiltersEnum.channel);
  }
}

export const storageUtils = createFilterTabUtils<string>(COLLECTION_FILTERS_KEY);

export const { areFiltersApplied, getActiveFilters, getFiltersCurrentTab } = createFilterUtils<
  CollectionListUrlQueryParams,
  CollectionListUrlFilters
>(CollectionListUrlFiltersEnum);
