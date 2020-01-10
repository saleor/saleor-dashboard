import { WebhookFilterInput } from "@saleor/types/globalTypes";
import { createFilterTabUtils, createFilterUtils } from "@saleor/utils/filters";
import { IFilterElement } from "@saleor/components/Filter";
import {
  WebhookListFilterOpts,
  WebhookFilterKeys
} from "@saleor/webhooks/components/WebhooksListPage";
import { parseBoolean, maybe } from "@saleor/misc";
import {
  WebhookListUrlFilters,
  WebhookListUrlFiltersEnum,
  WebhookListUrlQueryParams
} from "../../urls";

export const WEBHOOK_FILTERS_KEY = "webhookFilters";

export function getFilterOpts(
  params: WebhookListUrlFilters
): WebhookListFilterOpts {
  return {
    isActive: {
      active: maybe(() => params.active !== undefined, false),
      value:
        params.active !== undefined ? parseBoolean(params.active, true) : true
    }
  };
}

export function getFilterVariables(
  params: WebhookListUrlFilters
): WebhookFilterInput {
  return {
    isActive: params.active
      ? parseBoolean(params.active, undefined)
      : undefined,
    search: params.query
  };
}

export function getFilterQueryParam(
  filter: IFilterElement<WebhookFilterKeys>
): WebhookListUrlFilters {
  const { active, name, value } = filter;

  switch (name) {
    case WebhookFilterKeys.isActive:
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
} = createFilterTabUtils<WebhookListUrlFilters>(WEBHOOK_FILTERS_KEY);

export const { areFiltersApplied, getActiveFilters } = createFilterUtils<
  WebhookListUrlQueryParams,
  WebhookListUrlFilters
>(WebhookListUrlFiltersEnum);
