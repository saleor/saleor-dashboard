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
  onBack: () => undefined,
  onChannelsChange: () => undefined,
  onDelete: () => undefined,
  onSubmit: () => undefined,
  openChannelsModal: () => undefined,
  saveButtonBarState: "default",
  shippingChannels: defaultChannels,
  variant: ShippingMethodTypeEnum.PRICE
};

storiesOf("Shipping / ShippingZoneRates page", module)
  .addDecorator(Decorator)
  .add("default price", () => <ShippingZoneRatesPage {...props} />)
  .add("loading", () => (
    <ShippingZoneRatesPage
      {...props}
      disabled={true}
      saveButtonBarState={"loading"}
    />
  ))
  .add("update price", () => (
    <ShippingZoneRatesPage
      {...props}
      shippingChannels={channels}
      rate={shippingZone.shippingMethods[2]}
    />
  ))
  .add("default weight", () => (
    <ShippingZoneRatesPage {...props} variant={ShippingMethodTypeEnum.WEIGHT} />
  ))
  .add("update weight", () => (
    <ShippingZoneRatesPage
      {...props}
      shippingChannels={channels}
      rate={shippingZone.shippingMethods[0]}
      variant={ShippingMethodTypeEnum.WEIGHT}
    />
  ));
