import { channelsList } from "@dashboard/channels/fixtures";
import React from "react";

import {
  DiscountCreatePage,
  DiscountCreatePageProps,
} from "./DiscountCreatePage";

const props: DiscountCreatePageProps = {
  channels: channelsList,
  disabled: false,
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
  onBack: () => undefined,
  onSubmit: () => undefined,
};

export default {
  title: "Discounts / Discounts create page",
};

export const Default = () => <DiscountCreatePage {...props} />;
