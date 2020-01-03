import { IntlShape } from "react-intl";

import {
  SaleFilterInput,
  DiscountStatusEnum,
  DiscountValueTypeEnum
} from "@saleor/types/globalTypes";
import { maybe, findValueInEnum, joinDateTime } from "@saleor/misc";
import { SaleListFilterOpts } from "@saleor/discounts/types";
import { IFilter, IFilterElement } from "@saleor/components/Filter";
import {
  createDateField,
  createOptionsField
} from "@saleor/utils/filters/fields";
import {
  createFilterTabUtils,
  createFilterUtils,
  dedupeFilter
} from "../../../utils/filters";
import {
  SaleListUrlFilters,
  SaleListUrlFiltersEnum,
  SaleListUrlQueryParams
} from "../../urls";
import messages from "./messages";

export const SALE_FILTERS_KEY = "saleFilters";

export enum SaleFilterKeys {
  saleType = "saleType",
  started = "started",
  status = "status"
}

export function getFilterOpts(params: SaleListUrlFilters): SaleListFilterOpts {
  return {
    saleType: {
      active: !!maybe(() => params.type),
      value: maybe(() => findValueInEnum(params.type, DiscountValueTypeEnum))
    },
    started: {
      active: maybe(
        () =>
          [params.startedFrom, params.startedTo].some(
            field => field !== undefined
          ),
        false
      ),
      value: {
        max: maybe(() => params.startedTo, ""),
        min: maybe(() => params.startedFrom, "")
      }
    },
    status: {
      active: !!maybe(() => params.status),
      value: maybe(
        () =>
          dedupeFilter(
            params.status.map(status =>
              findValueInEnum(status, DiscountStatusEnum)
            )
          ),
        []
      )
    }
  };
}

export function createFilterStructure(
  intl: IntlShape,
  opts: SaleListFilterOpts
): IFilter<SaleFilterKeys> {
  return [
    {
      ...createDateField(
        SaleFilterKeys.started,
        intl.formatMessage(messages.started),
        opts.started.value
      ),
      active: opts.started.active
    },
    {
      ...createOptionsField(
        SaleFilterKeys.status,
        intl.formatMessage(messages.status),
        opts.status.value,
        true,
        [
          {
            label: intl.formatMessage(messages.active),
            value: DiscountStatusEnum.ACTIVE
          },
          {
            label: intl.formatMessage(messages.expired),
            value: DiscountStatusEnum.EXPIRED
          },
          {
            label: intl.formatMessage(messages.scheduled),
            value: DiscountStatusEnum.SCHEDULED
          }
        ]
      ),
      active: opts.status.active
    },
    {
      ...createOptionsField(
        SaleFilterKeys.saleType,
        intl.formatMessage(messages.type),
        [opts.saleType.value],
        false,
        [
          {
            label: intl.formatMessage(messages.fixed),
            value: DiscountValueTypeEnum.FIXED
          },
          {
            label: intl.formatMessage(messages.percentage),
            value: DiscountValueTypeEnum.PERCENTAGE
          }
        ]
      ),
      active: opts.saleType.active
    }
  ];
}

export function getFilterVariables(
  params: SaleListUrlFilters
): SaleFilterInput {
  return {
    saleType:
      params.type && findValueInEnum(params.type, DiscountValueTypeEnum),
    search: params.query,
    started: {
      gte: joinDateTime(params.startedFrom),
      lte: joinDateTime(params.startedTo)
    },
    status:
      params.status &&
      params.status.map(status => findValueInEnum(status, DiscountStatusEnum))
  };
}

export function getFilterQueryParam(
  filter: IFilterElement<SaleFilterKeys>
): SaleListUrlFilters {
  const { active, multiple, name, value } = filter;

  switch (name) {
    case SaleFilterKeys.saleType:
      if (!active) {
        return {
          type: undefined
        };
      }

      return {
        type: findValueInEnum(value[0], DiscountValueTypeEnum)
      };

    case SaleFilterKeys.started:
      if (!active) {
        return {
          startedFrom: undefined,
          startedTo: undefined
        };
      }
      if (multiple) {
        return {
          startedFrom: value[0],
          startedTo: value[1]
        };
      }

      return {
        startedFrom: value[0],
        startedTo: value[0]
      };

    case SaleFilterKeys.status:
      if (!active) {
        return {
          status: undefined
        };
      }
      return {
        status: value.map(val => findValueInEnum(val, DiscountStatusEnum))
      };
  }
}

export const {
  deleteFilterTab,
  getFilterTabs,
  saveFilterTab
} = createFilterTabUtils<SaleListUrlFilters>(SALE_FILTERS_KEY);

export const { areFiltersApplied, getActiveFilters } = createFilterUtils<
  SaleListUrlQueryParams,
  SaleListUrlFilters
>(SaleListUrlFiltersEnum);
