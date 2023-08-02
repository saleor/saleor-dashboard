// @ts-strict-ignore
import { channelsList } from "@dashboard/channels/fixtures";
import { createSaleChannels } from "@dashboard/channels/utils";
import { DiscountErrorCode } from "@dashboard/graphql";
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

export default {
  title: "Discounts / Sale create",
};

export const Default = () => <SaleCreatePage {...props} />;

export const Loading = () => <SaleCreatePage {...props} disabled={true} />;

export const FormErrors = () => (
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
);
