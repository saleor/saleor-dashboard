import Decorator from "@saleor/storybook/Decorator";
import { storiesOf } from "@storybook/react";
import React from "react";

import AvailabilityCard from "./AvailabilityCard";
const props = {
  data: {
    availableForPurchase: "",
    isAvailableForPurchase: false,
    isPublished: true,
    publicationDate: "",
    visibleInListings: true
  },
  errors: [],
  messages: {
    hiddenLabel: "Not published",
    hiddenSecondLabel: "hidden label",
    visibleLabel: "Published"
  },
  onChange: () => undefined
};

storiesOf("Generics / AvailabilityCard", module)
  .addDecorator(Decorator)
  .add("default", () => <AvailabilityCard {...props} />);
