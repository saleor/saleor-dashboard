import { channelsList } from "@dashboard/channels/fixtures";
import { createSaleChannels } from "@dashboard/channels/utils";
import { DiscountErrorCode } from "@dashboard/graphql";
import Decorator from "@dashboard/storybook/Decorator";
import { storiesOf } from "@storybook/react";
import React from "react";

import SaleCreatePage, { SaleCreatePageProps } from "./SaleCreatePage";

const channels = createSaleChannels(channelsList);

const props: SaleCreatePageProps = {
  allChannelsCount: channels.length,
  channelListings: channels,
  disabled: false,
  errors: [],
  onBack: () => undefined,
  onChannelsChange: () => undefined,
  onSubmit: () => undefined,
  openChannelsModal: () => undefined,
  saveButtonBarState: "default",
};

storiesOf("Discounts / Sale create", module)
  .addDecorator(Decorator)
  .add("default", () => <SaleCreatePage {...props} />)
  .add("loading", () => <SaleCreatePage {...props} disabled={true} />)
  .add("form errors", () => (
    <SaleCreatePage
      {...props}
      errors={["name", "startDate", "endDate", "value"].map(field => ({
        __typename: "DiscountError",
        channels: [],
        code: DiscountErrorCode.INVALID,
        field,
        message: "Discount invalid",
      }))}
    />
  ));
