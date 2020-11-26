import { stringify as stringifyQs } from "qs";
import urlJoin from "url-join";

import { BulkAction, Dialog, Pagination, SingleAction } from "../types";
import { ShippingMethodTypeEnum } from "../types/globalTypes";

export const shippingSection = "/shipping/";

export const shippingZonesListPath = shippingSection;
export type ShippingZonesListUrlDialog = "remove" | "remove-many";
export type ShippingZonesListUrlQueryParams = BulkAction &
  Dialog<ShippingZonesListUrlDialog> &
  Pagination &
  SingleAction;
export const shippingZonesListUrl = (
  params?: ShippingZonesListUrlQueryParams
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
export type ShippingZoneUrlQueryParams = Dialog<ShippingZoneUrlDialog> &
  SingleAction &
  Partial<{
    type: ShippingMethodTypeEnum;
  }>;
export const shippingZoneUrl = (
  id: string,
  params?: ShippingZoneUrlQueryParams
) => shippingZonePath(encodeURIComponent(id)) + "?" + stringifyQs(params);

export type ShippingRateUrlDialog = "add-range" | "remove" | "remove-range";
export type ShippingRateUrlQueryParams = Dialog<ShippingRateUrlDialog> &
  SingleAction;

export const shippingPriceRatesPath = (id: string) =>
  urlJoin(shippingZonePath(id), "price", "add");
export const shippingPriceRatesUrl = (id: string) =>
  shippingPriceRatesPath(encodeURIComponent(id));

export const shippingWeightRatesPath = (id: string) =>
  urlJoin(shippingZonePath(id), "weight", "add");
export const shippingWeightRatesUrl = (id: string) =>
  shippingWeightRatesPath(encodeURIComponent(id));

export const shippingPriceRatesEditPath = (id: string, rateId: string) =>
  urlJoin(shippingZonePath(id), "price", rateId);
export const shippingPriceRatesEditUrl = (
  id: string,
  rateId: string,
  params: ShippingRateUrlQueryParams
) =>
  shippingPriceRatesEditPath(
    encodeURIComponent(id),
    encodeURIComponent(rateId)
  ) +
  "?" +
  stringifyQs(params);

export const shippingWeightRatesEditPath = (id: string, rateId: string) =>
  urlJoin(shippingZonePath(id), "weight", rateId);
export const shippingWeightRatesEditUrl = (
  id: string,
  rateId: string,
  params: ShippingRateUrlQueryParams
) =>
  shippingWeightRatesEditPath(
    encodeURIComponent(id),
    encodeURIComponent(rateId)
  ) +
  "?" +
  stringifyQs(params);

export const shippingZoneAddPath = urlJoin(shippingZonesListPath, "add");
export const shippingZoneAddUrl = shippingZoneAddPath;
export const shippingPriceRatesAddPath = urlJoin(
  shippingZonesListPath,
  "price",
  "add"
);
