import { ShippingMethodTypeEnum } from "@saleor/graphql";
import { shippingZone } from "@saleor/shipping/fixtures";
import Decorator from "@saleor/storybook//Decorator";
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
  onPostalCodeAssign: () => undefined,
  onPostalCodeInclusionChange: () => undefined,
  onPostalCodeUnassign: () => undefined,
  onPreviousPage: () => undefined,
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
  formId: Symbol()
};

export default {
  title: "Views / Shipping / Shipping rate",
  decorators: [Decorator]
};

export const CreatePriceRate = () => <ShippingZoneRatesPage {...props} />;

CreatePriceRate.story = {
  name: "create price rate"
};

export const CreateWeightRate = () => (
  <ShippingZoneRatesPage {...props} variant={ShippingMethodTypeEnum.WEIGHT} />
);

CreateWeightRate.story = {
  name: "create weight rate"
};

export const Loading = () => (
  <ShippingZoneRatesPage
    {...props}
    disabled={true}
    rate={undefined}
    saveButtonBarState={"loading"}
  />
);

Loading.story = {
  name: "loading"
};

export const UpdatePriceRate = () => (
  <ShippingZoneRatesPage
    {...props}
    shippingChannels={channels}
    rate={shippingZone.shippingMethods[2]}
  />
);

UpdatePriceRate.story = {
  name: "update price rate"
};

export const UpdateWeightRate = () => (
  <ShippingZoneRatesPage
    {...props}
    shippingChannels={channels}
    variant={ShippingMethodTypeEnum.WEIGHT}
  />
);

UpdateWeightRate.story = {
  name: "update weight rate"
};
