import { FilterElement, FilterElementRegular } from "@dashboard/components/Filter";
import { StaffMemberStatus, StaffUserInput } from "@dashboard/graphql";
import { findValueInEnum } from "@dashboard/misc";
import { StaffFilterKeys, StaffListFilterOpts } from "@dashboard/staff/components/StaffListPage";

import {
  createFilterTabUtils,
  createFilterUtils,
  getSingleEnumValueQueryParam,
} from "../../../utils/filters";
import { StaffListUrlFilters, StaffListUrlFiltersEnum, StaffListUrlQueryParams } from "../../urls";

export const STAFF_FILTERS_KEY = "staffFilters";

export function getFilterOpts(params: StaffListUrlFilters): StaffListFilterOpts {
  return {
    status: {
      active: params?.status !== undefined ?? false,
      value: params?.status ? findValueInEnum(params.status, StaffMemberStatus) : null,
    },
  };
}

export function getFilterVariables(params: StaffListUrlFilters): StaffUserInput {
  return {
    search: params.query,
    status: params.status ? findValueInEnum(params.status, StaffMemberStatus) : null,
  };
}

export function getFilterQueryParam(filter: FilterElement<StaffFilterKeys>): StaffListUrlFilters {
  const { name } = filter;

  switch (name) {
    case StaffFilterKeys.status:
      return getSingleEnumValueQueryParam(
        filter as FilterElementRegular<StaffFilterKeys.status>,
        StaffListUrlFiltersEnum.status,
        StaffMemberStatus,
      );
  }
}

export const storageUtils = createFilterTabUtils<string>(STAFF_FILTERS_KEY);

export const { areFiltersApplied, getActiveFilters, getFiltersCurrentTab } = createFilterUtils<
  StaffListUrlQueryParams,
  StaffListUrlFilters
>(StaffListUrlFiltersEnum);
