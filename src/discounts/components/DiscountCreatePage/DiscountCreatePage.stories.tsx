import { MockedProvider } from "@apollo/client/testing";
import { channelsList } from "@dashboard/channels/fixtures";
import React from "react";

import {
  searchCategoriesMock,
  searchCollectionsMock,
  searchProductsMock,
  searchVariantsMock,
} from "../DiscountRules/hooks/API/mocks";
import {
  DiscountCreatePage,
  DiscountCreatePageProps,
} from "./DiscountCreatePage";

const props: DiscountCreatePageProps = {
  channels: [channelsList[0]],
  disabled: false,
  onBack: () => undefined,
  onSubmit: () => undefined,
  errors: [],
  submitButtonState: "default",
};

export default {
  title: "Discounts / Discounts create page",
};

export const Default = () => (
  <MockedProvider
    mocks={[
      searchCategoriesMock,
      searchProductsMock,
      searchCollectionsMock,
      searchVariantsMock,
    ]}
  >
    <DiscountCreatePage {...props} />
  </MockedProvider>
);
