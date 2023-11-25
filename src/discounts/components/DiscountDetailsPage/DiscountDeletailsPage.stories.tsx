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
  conditionLabels: {},
  fetchOptions: () => {
    return {
      fetch: () => undefined,
      loading: false,
      options: [],
      fetchMoreProps: {
        hasMore: false,
        loading: false,
        onFetchMore: () => undefined,
      },
    };
  },
  submitButtonState: "default",
  data: discount,
};

export default {
  title: "Discounts / Discounts details page",
};

export const Default = () => <DiscountDetailsPage {...props} />;
