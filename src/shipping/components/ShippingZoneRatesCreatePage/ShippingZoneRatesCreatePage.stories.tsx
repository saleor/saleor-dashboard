// @ts-strict-ignore
import {
  PostalCodeRuleInclusionTypeEnum,
  ShippingMethodTypeEnum,
} from "@dashboard/graphql";
import { taxClasses } from "@dashboard/taxes/fixtures";
import React from "react";

import ShippingZoneRatesCreatePage, {
  ShippingZoneRatesCreatePageProps,
} from "./ShippingZoneRatesCreatePage";

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

const props: ShippingZoneRatesCreatePageProps = {
  backUrl: "",
  formId: Symbol("shipping-zone-rates-create-form-id"),
  allChannelsCount: 3,
  channelErrors: [],
  disabled: false,
  errors: [],
  onChannelsChange: () => undefined,
  onDelete: () => undefined,
  onPostalCodeAssign: () => undefined,
  onPostalCodeInclusionChange: () => undefined,
  onPostalCodeUnassign: () => undefined,
  onSubmit: () => undefined,
  openChannelsModal: () => undefined,
  postalCodes: [
    {
      __typename: "ShippingMethodPostalCodeRule",
      end: "51-200",
      id: "1",
      inclusionType: PostalCodeRuleInclusionTypeEnum.EXCLUDE,
      start: "51-220",
    },
    {
      __typename: "ShippingMethodPostalCodeRule",
      end: "31-101",
      id: "1",
      inclusionType: PostalCodeRuleInclusionTypeEnum.EXCLUDE,
      start: "44-205",
    },
  ],
  saveButtonBarState: "default",
  shippingChannels: defaultChannels,
  variant: ShippingMethodTypeEnum.PRICE,
  taxClasses,
  fetchMoreTaxClasses: undefined,
};

export default {
  title: "Shipping / ShippingZoneRatesCreatePage",
};

export const CreatePrice = () => <ShippingZoneRatesCreatePage {...props} />;

export const Loading = () => (
  <ShippingZoneRatesCreatePage
    {...props}
    disabled={true}
    saveButtonBarState={"loading"}
  />
);

export const CreateWeight = () => (
  <ShippingZoneRatesCreatePage
    {...props}
    shippingChannels={channels}
    variant={ShippingMethodTypeEnum.WEIGHT}
  />
);
