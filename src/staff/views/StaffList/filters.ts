import { StaffUserInput, StaffMemberStatus } from "@saleor/types/globalTypes";
import { maybe, findValueInEnum } from "@saleor/misc";
import { IFilterElement } from "@saleor/components/Filter";
import {
  StaffListFilterOpts,
  StaffFilterKeys
} from "@saleor/staff/components/StaffListPage";
import {
  createFilterTabUtils,
  createFilterUtils,
  getSingleEnumValueQueryParam
} from "../../../utils/filters";
import {
  StaffListUrlFilters,
  StaffListUrlFiltersEnum,
  StaffListUrlQueryParams
} from "../../urls";

export const STAFF_FILTERS_KEY = "staffFilters";

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
  const { name } = filter;

  switch (name) {
    case StaffFilterKeys.status:
      return getSingleEnumValueQueryParam(
        filter,
        StaffListUrlFiltersEnum.status,
        StaffMemberStatus
      );
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
