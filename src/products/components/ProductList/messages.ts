import { defineMessages } from "react-intl";

export const messages = defineMessages({
  published: {
    defaultMessage: "Published on {date}",
    description: "product publication date"
  },
  unpublished: {
    defaultMessage: "Unpublished",
    description: "product publication date"
  },
  willBePublished: {
    defaultMessage: "Becomes published on {date}",
    description: "product publication date"
  }
});

export const columnsMessages = defineMessages({
  availability: {
    defaultMessage: "Availability",
    description: "product channels"
  },
  price: {
    defaultMessage: "Price",
    description: "product price"
  },
  type: {
    defaultMessage: "Type",
    description: "product type"
  },
  updatedAt: {
    defaultMessage: "Last updated",
    description: "product updated at"
  }
});
