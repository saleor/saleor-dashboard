import { countries } from "@saleor/fixtures";
import { ChannelErrorFragment } from "@saleor/graphql";
import Decorator from "@saleor/storybook/Decorator";
import { storiesOf } from "@storybook/react";
import React from "react";

import { channel, channelCreateErrors } from "../../fixtures";
import ChannelDetailsPage, {
  ChannelDetailsPageProps,
} from "./ChannelDetailsPage";

const props: ChannelDetailsPageProps<ChannelErrorFragment[]> = {
  currencyCodes: [
    { label: "USD", value: "USD" },
    { label: "PLN", value: "PLN" },
  ],
  disabled: false,
  disabledStatus: false,
  errors: [],
  onSubmit: () => undefined,
  saveButtonBarState: "default",
  updateChannelStatus: () => undefined,
  searchShippingZones: () => undefined,
  searchShippingZonesData: undefined,
  searchWarehouses: () => undefined,
  searchWarehousesData: undefined,
  countries: countries.map(({ name, code }) => ({
    code,
    country: name,
    __typename: "CountryDisplay",
  })),
  channelShippingZones: {
    __typename: "Query",
    allShippingZones: {
      __typename: "ShippingZoneCountableConnection",
      totalCount: 10,
    },
    shippingZones: {
      __typename: "ShippingZoneCountableConnection",
      edges: [
        {
          __typename: "ShippingZoneCountableEdge",
          node: {
            __typename: "ShippingZone",
            id: "zone-1",
            name: "Europe",
          },
        },
        {
          __typename: "ShippingZoneCountableEdge",
          node: {
            __typename: "ShippingZone",
            id: "zone-2",
            name: "USA",
          },
        },
      ],
    },
  },
  fetchMoreShippingZones: {
    loading: false,
    hasMore: false,
    onFetchMore: () => undefined,
    totalCount: 0,
  },
  channelWarehouses: {
    __typename: "Query",
    allWarehouses: {
      __typename: "WarehouseCountableConnection",
      totalCount: 10,
    },
    warehouses: {
      __typename: "WarehouseCountableConnection",
      edges: [
        {
          __typename: "WarehouseCountableEdge",
          node: {
            __typename: "Warehouse",
            id: "warehouse-1",
            name: "Warehouse 1",
          },
        },
        {
          __typename: "WarehouseCountableEdge",
          node: {
            __typename: "Warehouse",
            id: "warehouse-2",
            name: "Warehouse 2",
          },
        },
      ],
    },
  },
  fetchMoreWarehouses: {
    loading: false,
    hasMore: false,
    onFetchMore: () => undefined,
    totalCount: 0,
  },
};

storiesOf("Views / Channels / Channel details", module)
  .addDecorator(Decorator)
  .add("default", () => <ChannelDetailsPage {...props} />)
  .add("disabled", () => <ChannelDetailsPage {...props} disabled={true} />)
  .add("loading", () => (
    <ChannelDetailsPage {...props} saveButtonBarState={"loading"} />
  ))
  .add("with data", () => <ChannelDetailsPage {...props} channel={channel} />)
  .add("without editable currency code", () => (
    <ChannelDetailsPage
      {...props}
      currencyCodes={undefined}
      channel={channel}
    />
  ))
  .add("with errors", () => (
    <ChannelDetailsPage {...props} errors={channelCreateErrors} />
  ));
