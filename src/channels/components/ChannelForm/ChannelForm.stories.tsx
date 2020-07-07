import Decorator from "@saleor/storybook/Decorator";
import { storiesOf } from "@storybook/react";
import React from "react";

import { channelCreateErrors } from "../../fixtures";
import ChannelForm, { ChannelFormProps } from "./ChannelForm";

const props: ChannelFormProps = {
  data: {
    currencyCode: "euro",
    name: "Test",
    slug: "test"
  },
  disabled: false,
  errors: [],
  onChange: () => undefined
};

storiesOf("Views / Channels / Channel form", module)
  .addDecorator(Decorator)
  .add("default", () => <ChannelForm {...props} />)
  .add("disabled", () => <ChannelForm {...props} disabled={true} />)
  .add("with errors", () => (
    <ChannelForm {...props} errors={channelCreateErrors} />
  ));
