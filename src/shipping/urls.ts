import { ChannelsAction } from "@saleor/channels/urls";
import { ShippingMethodTypeEnum } from "@saleor/graphql";
import { stringifyQs } from "@saleor/utils/urls";
import urlJoin from "url-join";

import { BulkAction, Dialog, Pagination, SingleAction } from "../types";

export const shippingSection = "/shipping/";

export const shippingZonesListPath = shippingSection;
export type ShippingZonesListUrlDialog = "remove" | "remove-many";
export type ShippingZonesListUrlQueryParams = BulkAction &
  Dialog<ShippingZonesListUrlDialog> &
  Pagination &
  SingleAction;
export const shippingZonesListUrl = (
  params?: ShippingZonesListUrlQueryParams,
) => shippingZonesListPath + "?" + stringifyQs(params);

export const shippingZonePath = (id: string) =>
  urlJoin(shippingZonesListPath, id);
export type ShippingZoneUrlDialog =
  | "add-rate"
  | "add-warehouse"
  | "assign-country"
  | "edit-rate"
  | "remove"
  | "remove-rate"
  | "unassign-country";

export type ShippingMethodActions = "assign-product" | "unassign-product";

export type ShippingZoneUrlQueryParams = Dialog<ShippingZoneUrlDialog> &
  SingleAction &
  Partial<{
    type: ShippingMethodTypeEnum;
  }>;
export const shippingZoneUrl = (
  id: string,
  params?: ShippingZoneUrlQueryParams,
) => shippingZonePath(encodeURIComponent(id)) + "?" + stringifyQs(params);

type ZipCodeRangeActions = "add-range" | "remove-range";
export type ShippingRateUrlDialog =
  | ZipCodeRangeActions
  | "remove"
  | ShippingMethodActions
  | ChannelsAction;

export type ShippingRateUrlQueryParams = Dialog<ShippingRateUrlDialog> &
  SingleAction &
  BulkAction;
export type ShippingRateCreateUrlDialog = ZipCodeRangeActions | ChannelsAction;
export type ShippingRateCreateUrlQueryParams = Dialog<
  ShippingRateCreateUrlDialog
> &
  SingleAction &
  Partial<{
    type: ShippingMethodTypeEnum;
  }>;

export const shippingRateCreatePath = (id: string) =>
  urlJoin(shippingZonePath(id), "add");
export const shippingRateCreateUrl = (
  id: string,
  params?: ShippingRateCreateUrlQueryParams,
) => shippingRateCreatePath(encodeURIComponent(id)) + "?" + stringifyQs(params);

export const shippingRateEditPath = (id: string, rateId: string) =>
  urlJoin(shippingZonePath(id), rateId);
export const shippingRateEditUrl = (
  id: string,
  rateId: string,
  params?: ShippingRateUrlQueryParams,
) =>
  shippingRateEditPath(encodeURIComponent(id), encodeURIComponent(rateId)) +
  "?" +
  stringifyQs(params);

export const shippingZoneAddPath = urlJoin(shippingZonesListPath, "add");
export const shippingZoneAddUrl = shippingZoneAddPath + "?";
