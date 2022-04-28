import { countries } from "@saleor/fixtures";
import { ChannelErrorFragment } from "@saleor/graphql";
import Decorator from "@saleor/storybook/Decorator";
import React from "react";

import { channel, channelCreateErrors } from "../../fixtures";
import ChannelDetailsPage, {
  ChannelDetailsPageProps
} from "./ChannelDetailsPage";

const props: ChannelDetailsPageProps<ChannelErrorFragment[]> = {
  currencyCodes: [
    { label: "USD", value: "USD" },
    { label: "PLN", value: "PLN" }
  ],
  disabled: false,
  disabledStatus: false,
  errors: [],
  onBack: () => undefined,
  onSubmit: () => undefined,
  saveButtonBarState: "default",
  updateChannelStatus: () => undefined,
  searchShippingZones: () => undefined,
  searchShippingZonesData: undefined,
  countries: countries.map(({ name, code }) => ({
    code,
    country: name,
    __typename: "CountryDisplay"
  })),
  channelShippingZones: [
    {
      __typename: "ShippingZone",
      id: "zone-1",
      name: "Europe"
    },
    {
      __typename: "ShippingZone",
      id: "zone-2",
      name: "USA"
    }
  ],
  fetchMoreShippingZones: {
    loading: false,
    hasMore: false,
    onFetchMore: () => undefined,
    totalCount: 0
  }
};

export default {
  title: "Views / Channels / Channel details",
  decorators: [Decorator]
};

export const Default = () => <ChannelDetailsPage {...props} />;

Default.story = {
  name: "default"
};

export const Disabled = () => <ChannelDetailsPage {...props} disabled={true} />;

Disabled.story = {
  name: "disabled"
};

export const Loading = () => (
  <ChannelDetailsPage {...props} saveButtonBarState={"loading"} />
);

Loading.story = {
  name: "loading"
};

export const WithData = () => (
  <ChannelDetailsPage {...props} channel={channel} />
);

WithData.story = {
  name: "with data"
};

export const WithoutEditableCurrencyCode = () => (
  <ChannelDetailsPage {...props} currencyCodes={undefined} channel={channel} />
);

WithoutEditableCurrencyCode.story = {
  name: "without editable currency code"
};

export const WithErrors = () => (
  <ChannelDetailsPage {...props} errors={channelCreateErrors} />
);

WithErrors.story = {
  name: "with errors"
};
