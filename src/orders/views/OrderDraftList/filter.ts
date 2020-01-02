import { IntlShape } from "react-intl";

import { OrderDraftFilterInput } from "@saleor/types/globalTypes";
import { maybe } from "@saleor/misc";
import { OrderDraftListFilterOpts } from "@saleor/orders/types";
import { IFilter, IFilterElement } from "@saleor/components/Filter";
import { createTextField, createDateField } from "@saleor/utils/filters/fields";
import {
  OrderDraftListUrlFilters,
  OrderDraftListUrlFiltersEnum,
  OrderDraftListUrlQueryParams
} from "../../urls";
import {
  createFilterTabUtils,
  createFilterUtils
} from "../../../utils/filters";
import messages from "./messages";

export const ORDER_DRAFT_FILTERS_KEY = "orderDraftFilters";

export enum OrderDraftFilterKeys {
  created = "created",
  customer = "customer"
}

export function getFilterOpts(
  params: OrderDraftListUrlFilters
): OrderDraftListFilterOpts {
  return {
    created: {
      active: maybe(
        () =>
          [params.createdFrom, params.createdTo].some(
            field => field !== undefined
          ),
        false
      ),
      value: {
        max: maybe(() => params.createdTo),
        min: maybe(() => params.createdFrom)
      }
    },
    customer: {
      active: !!maybe(() => params.customer),
      value: params.customer
    }
  };
}

export function createFilterStructure(
  intl: IntlShape,
  opts: OrderDraftListFilterOpts
): IFilter<OrderDraftFilterKeys> {
  return [
    {
      ...createDateField(
        OrderDraftFilterKeys.created,
        intl.formatMessage(messages.created),
        opts.created.value
      ),
      active: opts.created.active
    },
    {
      ...createTextField(
        OrderDraftFilterKeys.customer,
        intl.formatMessage(messages.customer),
        opts.customer.value
      ),
      active: opts.customer.active
    }
  ];
}

export function getFilterVariables(
  params: OrderDraftListUrlFilters
): OrderDraftFilterInput {
  return {
    created: {
      gte: params.createdFrom,
      lte: params.createdTo
    },
    customer: params.customer,
    search: params.query
  };
}

export function getFilterQueryParam(
  filter: IFilterElement<OrderDraftFilterKeys>
): OrderDraftListUrlFilters {
  const { active, multiple, name, value } = filter;

  switch (name) {
    case OrderDraftFilterKeys.created:
      if (!active) {
        return {
          createdFrom: undefined,
          createdTo: undefined
        };
      }
      if (multiple) {
        return {
          createdFrom: value[0],
          createdTo: value[1]
        };
      }

      return {
        createdFrom: value[0],
        createdTo: value[0]
      };

    case OrderDraftFilterKeys.customer:
      if (!active) {
        return {
          customer: undefined
        };
      }
      return {
        customer: value[0]
      };
  }
}

export const {
  deleteFilterTab,
  getFilterTabs,
  saveFilterTab
} = createFilterTabUtils<OrderDraftListUrlFilters>(ORDER_DRAFT_FILTERS_KEY);

export const { areFiltersApplied, getActiveFilters } = createFilterUtils<
  OrderDraftListUrlQueryParams,
  OrderDraftListUrlFilters
>(OrderDraftListUrlFiltersEnum);
