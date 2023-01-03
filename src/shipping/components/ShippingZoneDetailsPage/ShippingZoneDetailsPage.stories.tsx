import { fetchMoreProps, searchPageProps } from "@saleor/fixtures";
import { ShippingErrorCode } from "@saleor/graphql";
import Decorator from "@saleor/storybook/Decorator";
import { warehouseList } from "@saleor/warehouses/fixtures";
import { storiesOf } from "@storybook/react";
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

storiesOf("Shipping / Shipping zone details", module)
  .addDecorator(Decorator)
  .add("default", () => <ShippingZoneDetailsPage {...props} />)
  .add("loading", () => (
    <ShippingZoneDetailsPage
      {...props}
      disabled={true}
      shippingZone={undefined}
    />
  ))
  .add("form errors", () => (
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
  ));
