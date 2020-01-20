import { stringify as stringifyQs } from "qs";
import urlJoin from "url-join";

import {
  ActiveTab,
  BulkAction,
  Dialog,
  Filters,
  Pagination,
  TabActionDialog,
  Sort
} from "../types";

const staffSection = "/staff/";

export const staffListPath = staffSection;
export enum StaffListUrlFiltersEnum {
  status = "status",
  query = "query"
}
export type StaffListUrlFilters = Filters<StaffListUrlFiltersEnum>;
export type StaffListUrlDialog = "add" | "remove" | TabActionDialog;
export enum StaffListUrlSortField {
  name = "name",
  email = "email"
}
export type StaffListUrlSort = Sort<StaffListUrlSortField>;
export type StaffListUrlQueryParams = ActiveTab &
  BulkAction &
  Dialog<StaffListUrlDialog> &
  Pagination &
  StaffListUrlFilters &
  StaffListUrlSort;
export const staffListUrl = (params?: StaffListUrlQueryParams) =>
  staffListPath + "?" + stringifyQs(params);

export const staffMemberDetailsPath = (id: string) => urlJoin(staffSection, id);
export type StaffMemberDetailsUrlDialog =
  | "change-password"
  | "remove"
  | "remove-avatar";
export type StaffMemberDetailsUrlQueryParams = Dialog<
  StaffMemberDetailsUrlDialog
>;

export const staffMemberDetailsUrl = (
  id: string,
  params?: StaffMemberDetailsUrlQueryParams
) => staffMemberDetailsPath(encodeURIComponent(id)) + "?" + stringifyQs(params);
