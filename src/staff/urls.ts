import { stringify as stringifyQs } from "qs";
import urlJoin from "url-join";

import {
  ActiveTab,
  BulkAction,
  Dialog,
  Filters,
  Pagination,
  TabActionDialog
} from "../types";

const staffSection = "/staff/";

export const staffListPath = staffSection;
export enum StaffListUrlFiltersEnum {
  query = "query"
}
export type StaffListUrlFilters = Filters<StaffListUrlFiltersEnum>;
export type StaffListUrlDialog = "add" | "remove" | TabActionDialog;
export type StaffListUrlQueryParams = ActiveTab &
  BulkAction &
  Dialog<StaffListUrlDialog> &
  Pagination &
  StaffListUrlFilters;
export const staffListUrl = (params?: StaffListUrlQueryParams) =>
  staffListPath + "?" + stringifyQs(params);

export const staffMemberDetailsPath = (id: string) => urlJoin(staffSection, id);
export type StaffMemberDetailsUrlDialog = "remove" | "remove-avatar";
export type StaffMemberDetailsUrlQueryParams = Dialog<
  StaffMemberDetailsUrlDialog
>;

export const staffMemberDetailsUrl = (
  id: string,
  params?: StaffMemberDetailsUrlQueryParams
) => staffMemberDetailsPath(encodeURIComponent(id)) + "?" + stringifyQs(params);
