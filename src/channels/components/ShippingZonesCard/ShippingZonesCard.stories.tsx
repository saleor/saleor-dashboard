import { ChannelShippingZones } from "@saleor/channels/pages/ChannelDetailsPage/types";
import CommonDecorator from "@saleor/storybook/Decorator";
import React from "react";

import ShippingZonesCard from "./ShippingZonesCard";

const shippingZones = [
  {
    __typename: "ShippingZone",
    id: "2",
    name: "Fancy shipping zone"
  },
  {
    __typename: "ShippingZone",
    id: "3",
    name: "Nice shipping zone"
  }
];

const baseProps = {
  addShippingZone: () => undefined,
  removeShippingZone: () => undefined,
  searchShippingZones: () => undefined,
  fetchMoreShippingZones: {
    loading: false,
    hasMore: false,
    onFetchMore: () => undefined,
    totalCount: 0
  },
  shippingZones: [],
  shippingZonesChoices: shippingZones as ChannelShippingZones
};

export default {
  title: "Shipping zones card",
  decorators: [CommonDecorator]
};

export const WithNoOptionsSelected = () => <ShippingZonesCard {...baseProps} />;

WithNoOptionsSelected.story = {
  name: "with no options selected"
};

export const WithOptionsSelected = () => (
  <ShippingZonesCard
    {...baseProps}
    shippingZones={shippingZones as ChannelShippingZones}
  />
);

WithOptionsSelected.story = {
  name: "with options selected"
};
