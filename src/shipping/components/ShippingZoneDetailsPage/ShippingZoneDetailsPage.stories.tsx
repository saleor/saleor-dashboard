// @ts-strict-ignore
import { fetchMoreProps, searchPageProps } from "@dashboard/fixtures";
import { ShippingErrorCode } from "@dashboard/graphql";
import { warehouseList } from "@dashboard/warehouses/fixtures";
import React from "react";

import { shippingZone } from "../../fixtures";
import ShippingZoneDetailsPage, {
  ShippingZoneDetailsPageProps,
} from "./ShippingZoneDetailsPage";

const props: ShippingZoneDetailsPageProps = {
  ...fetchMoreProps,
  ...searchPageProps,
  disabled: false,
  errors: [],
  onCountryAdd: () => undefined,
  onCountryRemove: () => undefined,
  onDelete: () => undefined,
  onPriceRateAdd: () => undefined,
  getPriceRateEditHref: () => "",
  onRateRemove: () => undefined,
  onSubmit: () => undefined,
  onWarehouseAdd: () => undefined,
  onWeightRateAdd: () => undefined,
  getWeightRateEditHref: () => "",
  saveButtonBarState: "default",
  selectedChannelId: "12345",
  shippingZone,
  warehouses: warehouseList,
};

export default {
  title: "Shipping / Shipping zone details",
};

export const Default = () => <ShippingZoneDetailsPage {...props} />;

export const Loading = () => (
  <ShippingZoneDetailsPage
    {...props}
    disabled={true}
    shippingZone={undefined}
  />
);

export const FormErrors = () => (
  <ShippingZoneDetailsPage
    {...props}
    errors={["name"].map(field => ({
      __typename: "ShippingError",
      channels: [],
      code: ShippingErrorCode.INVALID,
      field,
      message: "Name field invalid",
    }))}
  />
);
