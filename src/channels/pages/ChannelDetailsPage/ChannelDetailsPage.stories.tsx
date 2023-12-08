import { channel, channelCreateErrors } from "@dashboard/channels/fixtures";
import { countries } from "@dashboard/fixtures";
import { ChannelErrorFragment } from "@dashboard/graphql";
import { SubmitPromise } from "@dashboard/hooks/useForm";
import React from "react";

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
  onSubmit: async () => undefined as unknown as SubmitPromise,
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
  allShippingZonesCount: 10,
  channelShippingZones: [
    {
      __typename: "ShippingZone",
      id: "zone-1",
      name: "Europe",
    },
    {
      __typename: "ShippingZone",
      id: "zone-2",
      name: "USA",
    },
  ],
  fetchMoreShippingZones: {
    loading: false,
    hasMore: false,
    onFetchMore: () => undefined,
    totalCount: 0,
  },
  allWarehousesCount: 10,
  channelWarehouses: [
    {
      __typename: "Warehouse",
      id: "warehouse-1",
      name: "Warehouse 1",
    },
    {
      __typename: "Warehouse",
      id: "warehouse-2",
      name: "Warehouse 2",
    },
  ],
  fetchMoreWarehouses: {
    loading: false,
    hasMore: false,
    onFetchMore: () => undefined,
    totalCount: 0,
  },
};

export default {
  title: "Channels / Channel details",
};

export const Default = () => <ChannelDetailsPage {...props} />;

export const Disabled = () => <ChannelDetailsPage {...props} disabled={true} />;

export const Loading = () => (
  <ChannelDetailsPage {...props} saveButtonBarState={"loading"} />
);

export const WithData = () => (
  <ChannelDetailsPage {...props} channel={channel} />
);

export const WithoutEditableCurrencyCode = () => (
  <ChannelDetailsPage {...props} currencyCodes={undefined} channel={channel} />
);

export const WithErrors = () => (
  <ChannelDetailsPage {...props} errors={channelCreateErrors} />
);
