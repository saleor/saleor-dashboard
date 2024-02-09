import { MockedProvider } from "@apollo/client/testing";
import { channelsList } from "@dashboard/channels/fixtures";
import { discount } from "@dashboard/discounts/fixtures";
import React from "react";

import {
  searchCategoriesMock,
  searchCollectionsMock,
  searchProductsMock,
  searchVariantsMock,
} from "../DiscountRules/componenets/RuleForm/components/RuleConditionValues/hooks/options/mocks";
import {
  DiscountDetailsPage,
  DiscountDetailsPageProps,
} from "./DiscountDetailsPage";

const props: DiscountDetailsPageProps = {
  channels: [channelsList[0]],
  disabled: false,
  onBack: () => undefined,
  onSubmit: () => undefined,
  onDelete: () => undefined,
  ruleConditionsOptionsDetailsMap: {
    "UHJvZHVjdDo3OQ==": "Bean Juice",
    "UHJvZHVjdDoxMTU=": "Black Hoodie",
    UHJvZHVjdFZhcmlhbnQ6OTg3: "45cm x 45cm",
    UHJvZHVjdFZhcmlhbnQ6MjE1: "1l",
  },
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

export const Default = () => (
  <MockedProvider
    mocks={[
      searchCategoriesMock,
      searchProductsMock,
      searchProductsMock,
      searchProductsMock,
      searchCollectionsMock,
      searchVariantsMock,
    ]}
  >
    <DiscountDetailsPage {...props} />
  </MockedProvider>
);
