import { stringifyQs } from "@dashboard/utils/urls";
import urlJoin from "url-join";

import { BulkAction, Dialog, Pagination, SingleAction, Sort } from "../types";

export const navigationSection = "/navigation";

export const menuListPath = navigationSection;
type MenuListUrlDialog = "add" | "remove" | "remove-many";
export enum MenuListUrlSortField {
  name = "name",
  items = "items",
}
type MenuListUrlSort = Sort<MenuListUrlSortField>;
export type MenuListUrlQueryParams = BulkAction &
  Dialog<MenuListUrlDialog> &
  MenuListUrlSort &
  Pagination &
  SingleAction;
export const menuListUrl = (params?: MenuListUrlQueryParams) =>
  menuListPath + "?" + stringifyQs(params);

export const menuPath = (id: string) => urlJoin(navigationSection, id);
type MenuUrlDialog = "add-item" | "edit-item" | "remove";
export type MenuUrlQueryParams = Dialog<MenuUrlDialog> & SingleAction;
export const menuUrl = (id: string, params?: MenuUrlQueryParams) =>
  menuPath(encodeURIComponent(id)) + "?" + stringifyQs(params);
