// @ts-strict-ignore
import { ShippingMethodTypeEnum } from "@dashboard/graphql";
import { shippingZone } from "@dashboard/shipping/fixtures";
import { taxClasses } from "@dashboard/taxes/fixtures";
import React from "react";

import { PaginatorContextDecorator } from "../../../../.storybook/decorators";
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
  formId: Symbol("shipping-zone-rates-details-form-id"),
  taxClasses,
  fetchMoreTaxClasses: undefined,
};

export default {
  title: "Shipping / Shipping rate",
  decorators: [PaginatorContextDecorator],
};

export const CreatePriceRate = () => <ShippingZoneRatesPage {...props} />;

export const CreateWeightRate = () => (
  <ShippingZoneRatesPage {...props} variant={ShippingMethodTypeEnum.WEIGHT} />
);

export const Loading = () => (
  <ShippingZoneRatesPage
    {...props}
    disabled={true}
    rate={undefined}
    saveButtonBarState={"loading"}
  />
);

export const UpdatePriceRate = () => (
  <ShippingZoneRatesPage
    {...props}
    shippingChannels={channels}
    rate={shippingZone.shippingMethods[2]}
  />
);

export const UpdateWeightRate = () => (
  <ShippingZoneRatesPage
    {...props}
    shippingChannels={channels}
    variant={ShippingMethodTypeEnum.WEIGHT}
  />
);
