import { ShippingMethodTypeEnum } from "@saleor/graphql";
import { shippingZone } from "@saleor/shipping/fixtures";
import Decorator from "@saleor/storybook//Decorator";
import { PaginatorContextDecorator } from "@saleor/storybook/PaginatorContextDecorator";
import { storiesOf } from "@storybook/react";
import React from "react";

import ShippingZoneRatesPage, {
  ShippingZoneRatesPageProps,
} from "./ShippingZoneRatesPage";

const channels = [
  {
    currency: "USD",
    id: "1",
    maxValue: "10",
    minValue: "0",
    name: "channel",
    price: "5",
  },
  {
    currency: "USD",
    id: "2",
    maxValue: "20",
    minValue: "1",
    name: "test",
    price: "6",
  },
];

const defaultChannels = [
  {
    currency: "USD",
    id: "1",
    maxValue: "",
    minValue: "",
    name: "channel",
    price: "",
  },
];

const props: ShippingZoneRatesPageProps = {
  backHref: "",
  allChannelsCount: 3,
  channelErrors: [],
  disabled: false,
  errors: [],
  isChecked: () => undefined,
  onChannelsChange: () => undefined,
  onDelete: () => undefined,
  onPostalCodeAssign: () => undefined,
  onPostalCodeInclusionChange: () => undefined,
  onPostalCodeUnassign: () => undefined,
  onProductAssign: () => undefined,
  onProductUnassign: () => undefined,
  onSubmit: () => undefined,
  openChannelsModal: () => undefined,
  postalCodeRules: [],
  rate: shippingZone.shippingMethods[0],
  saveButtonBarState: "default",
  selected: 0,
  shippingChannels: defaultChannels,
  toggle: () => undefined,
  toggleAll: () => undefined,
  toolbar: () => undefined,
  variant: ShippingMethodTypeEnum.PRICE,
  formId: Symbol(),
};

storiesOf("Views / Shipping / Shipping rate", module)
  .addDecorator(Decorator)
  .addDecorator(PaginatorContextDecorator)
  .add("create price rate", () => <ShippingZoneRatesPage {...props} />)
  .add("create weight rate", () => (
    <ShippingZoneRatesPage {...props} variant={ShippingMethodTypeEnum.WEIGHT} />
  ))
  .add("loading", () => (
    <ShippingZoneRatesPage
      {...props}
      disabled={true}
      rate={undefined}
      saveButtonBarState={"loading"}
    />
  ))
  .add("update price rate", () => (
    <ShippingZoneRatesPage
      {...props}
      shippingChannels={channels}
      rate={shippingZone.shippingMethods[2]}
    />
  ))
  .add("update weight rate", () => (
    <ShippingZoneRatesPage
      {...props}
      shippingChannels={channels}
      variant={ShippingMethodTypeEnum.WEIGHT}
    />
  ));
