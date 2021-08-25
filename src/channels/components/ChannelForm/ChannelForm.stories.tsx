import { countries } from "@saleor/fixtures";
import Decorator from "@saleor/storybook/Decorator";
import { CountryCode } from "@saleor/types/globalTypes";
import { storiesOf } from "@storybook/react";
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

storiesOf("Views / Channels / Channel form", module)
  .addDecorator(Decorator)
  .add("default", () => <ChannelForm {...props} />)
  .add("disabled", () => <ChannelForm {...props} disabled={true} />)
  .add("with errors", () => (
    <ChannelForm {...props} errors={channelCreateErrors} />
  ));
