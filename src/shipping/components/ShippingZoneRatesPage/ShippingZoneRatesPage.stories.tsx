import { shippingZone } from "@saleor/shipping/fixtures";
import Decorator from "@saleor/storybook//Decorator";
import { ShippingMethodTypeEnum } from "@saleor/types/globalTypes";
import { storiesOf } from "@storybook/react";
import React from "react";

import ShippingZoneRatesPage, {
  ShippingZoneRatesPageProps
} from "./ShippingZoneRatesPage";

const channels = [
  {
    currency: "USD",
    id: "1",
    maxValue: "10",
    minValue: "0",
    name: "channel",
    price: "5"
  },
  {
    currency: "USD",
    id: "2",
    maxValue: "20",
    minValue: "1",
    name: "test",
    price: "6"
  }
];

const defaultChannels = [
  {
    currency: "USD",
    id: "1",
    maxValue: "",
    minValue: "",
    name: "channel",
    price: ""
  }
];

const props: ShippingZoneRatesPageProps = {
  allChannelsCount: 3,
  channelErrors: [],
  disabled: false,
  errors: [],
  isChecked: () => undefined,
  onBack: () => undefined,
  onChannelsChange: () => undefined,
  onDelete: () => undefined,
  onNextPage: () => undefined,
  onPreviousPage: () => undefined,
  onProductAssign: () => undefined,
  onProductUnassign: () => undefined,
  onSubmit: () => undefined,
  onZipCodeAssign: () => undefined,
  onZipCodeUnassign: () => undefined,
  openChannelsModal: () => undefined,
  rate: shippingZone.shippingMethods[0],
  saveButtonBarState: "default",
  selected: 0,
  shippingChannels: defaultChannels,
  toggle: () => undefined,
  toggleAll: () => undefined,
  toolbar: () => undefined,
  variant: ShippingMethodTypeEnum.PRICE
};

storiesOf("Views / Shipping / Shipping rate", module)
  .addDecorator(Decorator)
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
