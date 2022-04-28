import { countries } from "@saleor/fixtures";
import { CountryCode } from "@saleor/graphql";
import Decorator from "@saleor/storybook/Decorator";
import React from "react";

import { channelCreateErrors } from "../../fixtures";
import ChannelForm, { ChannelFormProps } from "./ChannelForm";

const props: ChannelFormProps = {
  data: {
    currencyCode: "euro",
    shippingZonesIdsToAdd: [],
    shippingZonesIdsToRemove: [],
    name: "Test",
    slug: "test",
    defaultCountry: CountryCode.PL
  },
  disabled: false,
  errors: [],
  selectedCountryDisplayName: "Poland",
  countries: countries.map(({ name, code }) => ({ label: name, value: code })),
  onChange: () => undefined,
  onDefaultCountryChange: () => undefined
};

export default {
  title: "Views / Channels / Channel form",
  decorators: [Decorator]
};

export const Default = () => <ChannelForm {...props} />;

Default.story = {
  name: "default"
};

export const Disabled = () => <ChannelForm {...props} disabled={true} />;

Disabled.story = {
  name: "disabled"
};

export const WithErrors = () => (
  <ChannelForm {...props} errors={channelCreateErrors} />
);

WithErrors.story = {
  name: "with errors"
};
