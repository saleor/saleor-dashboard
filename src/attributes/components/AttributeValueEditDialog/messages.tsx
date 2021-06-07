import React from "react";
import { defineMessages, FormattedMessage } from "react-intl";

export const dialogMessages = defineMessages({
  name: {
    defaultMessage: "Storefront Name",
    description: "attribute name"
  },
  adminName: {
    defaultMessage: "Admin Name",
    description: "attribute admin name"
  },
  attributeValue: {
    defaultMessage: "Attribute Value",
    description: "attribute value name"
  }
});

export const addValue = (
  <FormattedMessage
    defaultMessage="Add Attribute Value"
    description="add attribute value"
  />
);

export const editValue = (
  <FormattedMessage
    defaultMessage="Edit Attribute Value"
    description="edit attribute value"
  />
);
