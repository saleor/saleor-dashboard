import { PluginFilterInput } from "@saleor/types/globalTypes";
import {
  PluginListFilterOpts,
  PluginFilterKeys
} from "@saleor/plugins/components/PluginsListPage";
import { maybe, parseBoolean } from "@saleor/misc";
import { IFilterElement } from "@saleor/components/Filter";
import {
  PluginListUrlFilters,
  PluginListUrlFiltersEnum,
  PluginListUrlQueryParams
} from "../../urls";
import {
  createFilterTabUtils,
  createFilterUtils
} from "../../../utils/filters";

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
  const { active, name, value } = filter;

  switch (name) {
    case PluginFilterKeys.active:
      if (!active) {
        return {
          active: undefined
        };
      }
      return {
        active: value[0]
      };
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
