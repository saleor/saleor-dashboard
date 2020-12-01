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
  onZipCodeAssign: () => undefined,
  onZipCodeUnassign: () => undefined,
  openChannelsModal: () => undefined,
  rate: null,
  saveButtonBarState: "default",
  shippingChannels: defaultChannels,
  variant: ShippingMethodTypeEnum.PRICE,
  zipCodes: [
    {
      __typename: "ShippingMethodZipCodeRule",
      end: "51-200",
      id: "1",
      start: "51-220"
    },
    {
      __typename: "ShippingMethodZipCodeRule",
      end: "31-101",
      id: "1",
      start: "44-205"
    }
  ]
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
      rate={shippingZone.shippingMethods[0]}
      variant={ShippingMethodTypeEnum.WEIGHT}
    />
  ))
  .add("no zip codes", () => (
    <ShippingZoneRatesPage {...props} zipCodes={[]} />
  ));
