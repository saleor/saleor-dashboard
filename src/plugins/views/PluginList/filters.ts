import { IFilterElement } from "@saleor/components/Filter";
import { maybe, parseBoolean } from "@saleor/misc";
import {
  PluginFilterKeys,
  PluginListFilterOpts
} from "@saleor/plugins/components/PluginsListPage";
import { PluginFilterInput } from "@saleor/types/globalTypes";

import {
  createFilterTabUtils,
  createFilterUtils,
  getSingleValueQueryParam
} from "../../../utils/filters";
import {
  PluginListUrlFilters,
  PluginListUrlFiltersEnum,
  PluginListUrlQueryParams
} from "../../urls";

export const PLUGIN_FILTERS_KEY = "pluginFilters";

export function getFilterOpts(
  params: PluginListUrlFilters
): PluginListFilterOpts {
  return {
    isActive: {
      active: maybe(() => params.active !== undefined, false),
      value:
        params.active !== undefined ? parseBoolean(params.active, true) : true
    }
  };
}

export function getFilterVariables(
  params: PluginListUrlFilters
): PluginFilterInput {
  return {
    active:
      params.active !== undefined
        ? parseBoolean(params.active, true)
        : undefined,
    search: params.query
  };
}

export function getFilterQueryParam(
  filter: IFilterElement<PluginFilterKeys>
): PluginListUrlFilters {
  const { name } = filter;

  switch (name) {
    case PluginFilterKeys.active:
      return getSingleValueQueryParam(filter, PluginListUrlFiltersEnum.active);
  }
}

export const {
  deleteFilterTab,
  getFilterTabs,
  saveFilterTab
} = createFilterTabUtils<PluginListUrlFilters>(PLUGIN_FILTERS_KEY);

export const { areFiltersApplied, getActiveFilters } = createFilterUtils<
  PluginListUrlQueryParams,
  PluginListUrlFilters
>(PluginListUrlFiltersEnum);
