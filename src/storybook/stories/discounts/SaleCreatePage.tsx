import { channelsList } from "@saleor/channels/fixtures";
import { createSaleChannels } from "@saleor/channels/utils";
import { DiscountErrorCode } from "@saleor/types/globalTypes";
import { storiesOf } from "@storybook/react";
import React from "react";

import SaleCreatePage, {
  SaleCreatePageProps
} from "../../../discounts/components/SaleCreatePage";
import Decorator from "../../Decorator";

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
  saveButtonBarState: "default"
};

storiesOf("Views / Discounts / Sale create", module)
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
        field
      }))}
    />
  ));
