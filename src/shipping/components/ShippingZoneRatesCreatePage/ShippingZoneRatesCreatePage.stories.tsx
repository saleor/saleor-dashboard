import Decorator from "@saleor/storybook//Decorator";
import { ShippingMethodTypeEnum } from "@saleor/types/globalTypes";
import { storiesOf } from "@storybook/react";
import React from "react";

import ShippingZoneRatesCreatePage, {
  ShippingZoneRatesCreatePageProps
} from "./ShippingZoneRatesCreatePage";

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

const props: ShippingZoneRatesCreatePageProps = {
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

storiesOf("Shipping / ShippingZoneRatesCreatePage page", module)
  .addDecorator(Decorator)
  .add("create price", () => <ShippingZoneRatesCreatePage {...props} />)
  .add("loading", () => (
    <ShippingZoneRatesCreatePage
      {...props}
      disabled={true}
      saveButtonBarState={"loading"}
    />
  ))
  .add("create weight", () => (
    <ShippingZoneRatesCreatePage
      {...props}
      shippingChannels={channels}
      variant={ShippingMethodTypeEnum.WEIGHT}
    />
  ));
