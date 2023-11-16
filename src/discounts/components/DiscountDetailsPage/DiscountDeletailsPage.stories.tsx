import { channelsList } from "@dashboard/channels/fixtures";
import { discount } from "@dashboard/discounts/fixtures";
import React from "react";

import {
  DiscountDetailsPage,
  DiscountDetailsPageProps,
} from "./DiscountDetailsPage";

const props: DiscountDetailsPageProps = {
  channels: channelsList,
  disabled: false,
  onBack: () => undefined,
  onSubmit: () => undefined,
  onRuleSubmit: () => undefined,
  discount,
};

export default {
  title: "Discounts / Discounts details page",
};

export const Default = () => <DiscountDetailsPage {...props} />;
