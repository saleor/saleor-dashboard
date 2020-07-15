import Decorator from "@saleor/storybook/Decorator";
import { storiesOf } from "@storybook/react";
import React from "react";

import { channel, channelCreateErrors } from "../../fixtures";
import ChannelDetailsPage, {
  ChannelDetailsPageProps
} from "./ChannelDetailsPage";

const props: ChannelDetailsPageProps = {
  disabled: false,
  editableCurrency: true,
  errors: [],
  onBack: () => undefined,
  onSubmit: () => undefined,
  saveButtonBarState: "default"
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
    <ChannelDetailsPage {...props} editableCurrency={false} channel={channel} />
  ))
  .add("with errors", () => (
    <ChannelDetailsPage {...props} errors={channelCreateErrors} />
  ));
