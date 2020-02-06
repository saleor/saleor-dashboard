import { stringify as stringifyQs } from "qs";
import urlJoin from "url-join";

import {
  BulkAction,
  Dialog,
  Pagination,
  TabActionDialog,
  Sort
} from "../types";

const permissionGroupSection = "/permission-groups/";

export const permissionGroupListPath = permissionGroupSection;

export type PermissionGroupListUrlDialog = "remove" | TabActionDialog;
export enum PermissionGroupListUrlSortField {
  name = "name"
}
export type PermissionGroupListUrlSort = Sort<PermissionGroupListUrlSortField>;
export type PermissionGroupListUrlQueryParams = BulkAction &
  Dialog<PermissionGroupListUrlDialog> &
  Pagination &
  PermissionGroupListUrlSort;
export const permissionGroupListUrl = (
  params?: PermissionGroupListUrlQueryParams
) => permissionGroupListPath + "?" + stringifyQs(params);

export const permissionGroupAddPath = urlJoin(permissionGroupSection, "add");
export const permissionGroupAddUrl = permissionGroupAddPath;

export const permissionGroupDetailsPath = (id: string) =>
  urlJoin(permissionGroupSection, id);
export type PermissionGroupDetailsUrlDialog = "remove";
export type PermissionGroupDetailsUrlQueryParams = BulkAction &
  Pagination &
  Dialog<PermissionGroupDetailsUrlDialog>;

export const permissionGroupDetailsUrl = (
  id: string,
  params?: PermissionGroupDetailsUrlQueryParams
) =>
  permissionGroupDetailsPath(encodeURIComponent(id)) +
  "?" +
  stringifyQs(params);
