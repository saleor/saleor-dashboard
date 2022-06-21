import { FilterElement, FilterElementRegular } from "@saleor/components/Filter";
import { PluginConfigurationType, PluginFilterInput } from "@saleor/graphql";
import { ChannelsWithLoadMoreProps } from "@saleor/hooks/useChannelsSearch";
import { maybe, parseBoolean } from "@saleor/misc";
import {
  PluginFilterKeys,
  PluginListFilterOpts,
} from "@saleor/plugins/components/PluginsListPage";
import { mapNodeToChoice } from "@saleor/utils/maps";

import {
  createFilterTabUtils,
  createFilterUtils,
  dedupeFilter,
  getMultipleValueQueryParam,
  getSingleEnumValueQueryParam,
  getSingleValueQueryParam,
} from "../../../utils/filters";
import {
  PluginListUrlFilters,
  PluginListUrlFiltersEnum,
  PluginListUrlQueryParams,
} from "../../urls";

export const PLUGIN_FILTERS_KEY = "pluginFilters";

export function getFilterOpts(
  params: PluginListUrlFilters,
  {
    channels,
    hasMore,
    onFetchMore,
    onSearchChange,
    loading,
  }: ChannelsWithLoadMoreProps,
): PluginListFilterOpts {
  return {
    isActive: {
      active: maybe(() => params.active !== undefined, false),
      value:
        params.active === undefined
          ? undefined
          : parseBoolean(params.active, true),
    },
    channels: {
      active: !!params.channels,
      choices: mapNodeToChoice(channels),
      displayValues: mapNodeToChoice(channels),
      initialSearch: "",
      hasMore,
      loading,
      onFetchMore,
      onSearchChange,
      value: dedupeFilter(params.channels || []),
    },
    type: {
      active: !!params.type,
      value: getParsedConfigType(params.type),
    },
    status: {
      active: !!params.channels?.length && params.active !== undefined,
      value:
        !!dedupeFilter(params.channels || [])?.length &&
        params.active !== undefined,
    },
  };
}

const getParsedConfigType = (configTypeString?: string) =>
  PluginConfigurationType[configTypeString] || undefined;

export function getFilterVariables(
  params: PluginListUrlFilters,
): PluginFilterInput {
  const baseParams = {
    type: getParsedConfigType(params.type),
    search: params.query,
  };

  if (!!params.active && !!params.channels?.length) {
    return {
      ...baseParams,
      statusInChannels: {
        active: parseBoolean(params.active, true),
        channels: params.channels,
      },
    };
  }

  return baseParams;
}

export function getFilterQueryParam(
  filter: FilterElement<PluginFilterKeys>,
): PluginListUrlFilters {
  const { name } = filter;

  switch (name) {
    case PluginFilterKeys.channels:
      return getMultipleValueQueryParam(
        filter,
        PluginListUrlFiltersEnum.channels,
      );

    case PluginFilterKeys.active:
      return getSingleValueQueryParam(filter, PluginListUrlFiltersEnum.active);

    case PluginFilterKeys.type:
      return getSingleEnumValueQueryParam(
        filter as FilterElementRegular<PluginFilterKeys.type>,
        PluginListUrlFiltersEnum.type,
        PluginConfigurationType,
      );
  }
}

export const {
  deleteFilterTab,
  getFilterTabs,
  saveFilterTab,
} = createFilterTabUtils<PluginListUrlFilters>(PLUGIN_FILTERS_KEY);

export const {
  areFiltersApplied,
  getActiveFilters,
  getFiltersCurrentTab,
} = createFilterUtils<PluginListUrlQueryParams, PluginListUrlFilters>(
  PluginListUrlFiltersEnum,
);
