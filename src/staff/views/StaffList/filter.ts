import { IntlShape } from "react-intl";

import { StaffUserInput, StaffMemberStatus } from "@saleor/types/globalTypes";
import { maybe, findValueInEnum } from "@saleor/misc";
import { IFilter, IFilterElement } from "@saleor/components/Filter";
import { createOptionsField } from "@saleor/utils/filters/fields";
import {
  createFilterTabUtils,
  createFilterUtils
} from "../../../utils/filters";
import {
  StaffListUrlFilters,
  StaffListUrlFiltersEnum,
  StaffListUrlQueryParams
} from "../../urls";
import { StaffListFilterOpts } from "../../types";
import messages from "./messages";

export const STAFF_FILTERS_KEY = "staffFilters";

export enum StaffFilterKeys {
  status = "status"
}

export function getFilterOpts(
  params: StaffListUrlFilters
): StaffListFilterOpts {
  return {
    status: {
      active: maybe(() => params.status !== undefined, false),
      value: maybe(() => findValueInEnum(params.status, StaffMemberStatus))
    }
  };
}

export function createFilterStructure(
  intl: IntlShape,
  opts: StaffListFilterOpts
): IFilter<StaffFilterKeys> {
  return [
    {
      ...createOptionsField(
        StaffFilterKeys.status,
        intl.formatMessage(messages.status),
        [opts.status.value],
        false,
        [
          {
            label: intl.formatMessage(messages.active),
            value: StaffMemberStatus.ACTIVE
          },
          {
            label: intl.formatMessage(messages.deactivated),
            value: StaffMemberStatus.DEACTIVATED
          }
        ]
      ),
      active: opts.status.active
    }
  ];
}

export function getFilterVariables(
  params: StaffListUrlFilters
): StaffUserInput {
  return {
    search: params.query,
    status: params.status
      ? findValueInEnum(params.status, StaffMemberStatus)
      : null
  };
}

export function getFilterQueryParam(
  filter: IFilterElement<StaffFilterKeys>
): StaffListUrlFilters {
  const { active, name, value } = filter;

  switch (name) {
    case StaffFilterKeys.status:
      if (!active) {
        return {
          status: undefined
        };
      }

      return {
        status: value[0]
      };
  }
}

export const {
  deleteFilterTab,
  getFilterTabs,
  saveFilterTab
} = createFilterTabUtils<StaffListUrlFilters>(STAFF_FILTERS_KEY);

export const { areFiltersApplied, getActiveFilters } = createFilterUtils<
  StaffListUrlQueryParams,
  StaffListUrlFilters
>(StaffListUrlFiltersEnum);
