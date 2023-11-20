import { channelsList } from "@dashboard/channels/fixtures";
import React from "react";

import {
  DiscountCreatePage,
  DiscountCreatePageProps,
} from "./DiscountCreatePage";

const props: DiscountCreatePageProps = {
  channels: channelsList,
  disabled: false,
  onBack: () => undefined,
  onSubmit: () => undefined,
};

export default {
  title: "Discounts / Discounts create page",
};

export const Default = () => <DiscountCreatePage {...props} />;
