import { limitsReached } from "@saleor/fixtures";
import React from "react";

import ProductVariantCreatorContent from "../ProductVariantCreatorContent";
import ProductVariantCreatorPage from "../ProductVariantCreatorPage";
import { props } from "./fixtures";

export default {
  title: "Views / Products / Create multiple variants"
};

export const ChooseValues = () => <ProductVariantCreatorContent {...props} />;

ChooseValues.story = {
  name: "choose values"
};

export const Interactive = () => (
  <ProductVariantCreatorPage
    {...props}
    limits={{
      ...limitsReached,
      currentUsage: {
        ...limitsReached.currentUsage,
        productVariants: limitsReached.currentUsage.productVariants - 6
      }
    }}
    onSubmit={() => undefined}
  />
);

Interactive.story = {
  name: "interactive"
};
