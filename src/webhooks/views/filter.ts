import { WebhookFilterInput } from "@saleor/types/globalTypes";
import { createFilterTabUtils, createFilterUtils } from "../../utils/filters";
import {
  WebhookListUrlFilters,
  WebhookListUrlFiltersEnum,
  WebhooksListUrlQueryParams
} from "../urls";

export const WEBHOOK_FILTERS_KEY = "webhookFilters";

export function getFilterVariables(
  params: WebhookListUrlFilters
): WebhookFilterInput {
  return {
    search: params.query
  };
}

export const {
  deleteFilterTab,
  getFilterTabs,
  saveFilterTab
} = createFilterTabUtils<WebhookListUrlFilters>(WEBHOOK_FILTERS_KEY);

export const { areFiltersApplied, getActiveFilters } = createFilterUtils<
  WebhooksListUrlQueryParams,
  WebhookListUrlFilters
>(WebhookListUrlFiltersEnum);
