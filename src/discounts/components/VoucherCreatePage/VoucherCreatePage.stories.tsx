import { channelsList } from "@saleor/channels/fixtures";
import { createVoucherChannels } from "@saleor/channels/utils";
import { DiscountErrorCode } from "@saleor/graphql";
import Decorator from "@saleor/storybook/Decorator";
import { storiesOf } from "@storybook/react";
import React from "react";

import VoucherCreatePage, {
  FormData,
  VoucherCreatePageProps,
} from "./VoucherCreatePage";

const channels = createVoucherChannels(channelsList);

const props: VoucherCreatePageProps = {
  allChannelsCount: channels.length,
  channelListings: channels,
  disabled: false,
  errors: [],
  onChannelsChange: () => undefined,
  onSubmit: () => undefined,
  openChannelsModal: () => undefined,
  saveButtonBarState: "default",
};

storiesOf("Discounts / Voucher create", module)
  .addDecorator(Decorator)
  .add("default", () => <VoucherCreatePage {...props} />)
  .add("form errors", () => (
    <VoucherCreatePage
      {...props}
      errors={([
        "applyOncePerOrder",
        "code",
        "discountType",
        "endDate",
        "minSpent",
        "name",
        "startDate",
        "type",
        "usageLimit",
        "value",
      ] as Array<keyof FormData>).map(field => ({
        __typename: "DiscountError",
        channels: [],
        code: DiscountErrorCode.INVALID,
        field,
        message: "Discount invalid",
      }))}
    />
  ));
