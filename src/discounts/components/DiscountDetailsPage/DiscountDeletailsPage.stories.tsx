import { MockedProvider } from "@apollo/client/testing";
import { channelsList } from "@dashboard/channels/fixtures";
import { discount, orderDiscount } from "@dashboard/discounts/fixtures";
import { LabelsMapsProovider } from "@dashboard/discounts/views/DiscountDetails/context/provider";
import {
  conditionsValuesLabelsMock,
  emptyGiftsLabelsMock,
  giftsLabelsMock,
} from "@dashboard/discounts/views/DiscountDetails/hooks/mocks";
import React from "react";

import {
  searchCategoriesMock,
  searchCollectionsMock,
  searchProductsMock,
  searchVariantsMock,
} from "../DiscountRules/componenets/RuleForm/components/RuleConditionValues/hooks/options/mocks";
import { variantsWithProductDataMock } from "../DiscountRules/componenets/RuleForm/components/RuleRewardGifts/mock";
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
  errors: [],
  onRuleCreateSubmit: () => Promise.resolve([]),
  onRuleDeleteSubmit: () => Promise.resolve([]),
  onRuleUpdateSubmit: () => Promise.resolve([]),
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
      emptyGiftsLabelsMock,
      conditionsValuesLabelsMock,
    ]}
  >
    <LabelsMapsProovider
      promotionData={{
        __typename: "Query",
        promotion: discount,
      }}
    >
      <DiscountDetailsPage {...props} />
    </LabelsMapsProovider>
  </MockedProvider>
);

export const OrderDiscounts = () => (
  <MockedProvider
    mocks={[
      searchCategoriesMock,
      searchProductsMock,
      searchProductsMock,
      searchProductsMock,
      searchCollectionsMock,
      searchVariantsMock,
      giftsLabelsMock,
      conditionsValuesLabelsMock,
      variantsWithProductDataMock,
    ]}
  >
    <LabelsMapsProovider
      promotionData={{
        __typename: "Query",
        promotion: orderDiscount,
      }}
    >
      <DiscountDetailsPage {...props} data={orderDiscount} />
    </LabelsMapsProovider>
  </MockedProvider>
);
