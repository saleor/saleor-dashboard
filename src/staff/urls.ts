import { stringifyQs } from "@dashboard/utils/urls";
import urlJoin from "url-join";

import {
  type ActiveTab,
  type BulkAction,
  type Dialog,
  type Filters,
  type Pagination,
  type Sort,
  type TabActionDialog,
} from "../types";

const staffSection = "/staff/";

export const staffListPath = staffSection;
export enum StaffListUrlFiltersEnum {
  status = "status",
  query = "query",
}
export type StaffListUrlFilters = Filters<StaffListUrlFiltersEnum>;
export type StaffListUrlDialog = "add" | "remove" | TabActionDialog;
export enum StaffListUrlSortField {
  name = "name",
  email = "email",
}
type StaffListUrlSort = Sort<StaffListUrlSortField>;
export type StaffListUrlQueryParams = ActiveTab &
  BulkAction &
  Dialog<StaffListUrlDialog> &
  Pagination &
  StaffListUrlFilters &
  StaffListUrlSort;
export const staffListUrl = (params?: StaffListUrlQueryParams) =>
  staffListPath + "?" + stringifyQs(params);

export const staffMemberDetailsPath = (id: string) => urlJoin(staffSection, id);
type StaffMemberDetailsUrlDialog = "reset-password" | "remove" | "remove-avatar";
export type StaffMemberDetailsUrlQueryParams = Dialog<StaffMemberDetailsUrlDialog>;

export const staffMemberDetailsUrl = (id: string, params?: StaffMemberDetailsUrlQueryParams) =>
  staffMemberDetailsPath(encodeURIComponent(id)) + "?" + stringifyQs(params);
