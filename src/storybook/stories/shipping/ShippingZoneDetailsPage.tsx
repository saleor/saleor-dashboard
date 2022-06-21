import { fetchMoreProps, searchPageProps } from "@saleor/fixtures";
import { ShippingErrorCode } from "@saleor/graphql";
import { warehouseList } from "@saleor/warehouses/fixtures";
import { storiesOf } from "@storybook/react";
import React from "react";

import ShippingZoneDetailsPage, {
  ShippingZoneDetailsPageProps,
} from "../../../shipping/components/ShippingZoneDetailsPage";
import { shippingZone } from "../../../shipping/fixtures";
import Decorator from "../../Decorator";

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

storiesOf("Views / Shipping / Shipping zone details", module)
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
