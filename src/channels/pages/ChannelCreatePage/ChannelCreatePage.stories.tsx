import Decorator from "@saleor/storybook/Decorator";
import { storiesOf } from "@storybook/react";
import React from "react";

import { channelCreateErrors } from "../../fixtures";
import ChannelCreatePage, { ChannelCreatePageProps } from "./ChannelCreatePage";

const props: ChannelCreatePageProps = {
  disabled: false,
  errors: [],
  onBack: () => undefined,
  onSubmit: () => undefined,
  saveButtonBarState: "default"
};

storiesOf("Views / Channels / Channel create", module)
  .addDecorator(Decorator)
  .add("default", () => <ChannelCreatePage {...props} />)
  .add("disabled", () => <ChannelCreatePage {...props} disabled={true} />)
  .add("loading", () => (
    <ChannelCreatePage {...props} saveButtonBarState={"loading"} />
  ))
  .add("with errors", () => (
    <ChannelCreatePage {...props} errors={channelCreateErrors} />
  ));
