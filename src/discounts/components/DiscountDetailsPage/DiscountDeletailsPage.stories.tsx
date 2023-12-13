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
  onDelete: () => undefined,
  ruleConditionsOptionsDetailsMap: {},
  errors: [],
  onRuleCreateSubmit: () => Promise.resolve([]),
  onRuleDeleteSubmit: () => Promise.resolve([]),
  onRuleUpdateSubmit: () => Promise.resolve([]),
  ruleConditionsOptionsDetailsLoading: false,
  ruleCreateButtonState: "default",
  ruleDeleteButtonState: "default",
  ruleUpdateButtonState: "default",
  submitButtonState: "default",
  data: discount,
};

export default {
  title: "Discounts / Discounts details page",
};

export const Default = () => <DiscountDetailsPage {...props} />;
