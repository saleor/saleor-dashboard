import { countries } from "@saleor/orders/fixtures";
import Decorator from "@saleor/storybook/Decorator";
import { taxConfigurations } from "@saleor/taxes/fixtures";
import { storiesOf } from "@storybook/react";
import React from "react";

import TaxChannelsPage from "./TaxChannelsPage";

const props = {
  taxConfigurations,
  countries,
  selectedChannelId: taxConfigurations[0].channel.id,
  handleTabChange: () => undefined
};

storiesOf("Views / Taxes / Channels view", module)
  .addDecorator(Decorator)
  .add("loading", () => <TaxChannelsPage {...props} taxConfigurations={[]} />)
  .add("default", () => <TaxChannelsPage {...props} />)
  .add("add country", () => <TaxChannelsPage {...props} />); // TODO: add country modal
