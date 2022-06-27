import { AttributeReference } from "@saleor/attributes/utils/data";
import React from "react";
import { defineMessages, useIntl } from "react-intl";

import AssignContainerDialog, {
  AssignContainerDialogProps,
} from "../AssignContainerDialog";

const messages = defineMessages({
  confirmBtn: {
    id: "ylobu9",
    defaultMessage: "Assign",
    description: "assign reference to product, button",
  },
  header: {
    id: "GUlwXU",
    defaultMessage: "Assign Attribute Value",
    description: "dialog header",
  },
  searchLabel: {
    id: "RoKOQJ",
    defaultMessage: "Search Attribute Value",
    description: "label",
  },
  searchPlaceholder: {
    id: "NsgWhZ",
    defaultMessage: "Search by value name, etc...",
    description: "placeholder",
  },
});

interface AssignAttributeValueDialogProps
  extends Omit<
    AssignContainerDialogProps,
    "containers" | "title" | "search" | "confirmButtonState" | "labels"
  > {
  attributeValues: AttributeReference[];
}

const AssignAttributeValueDialog: React.FC<AssignAttributeValueDialogProps> = ({
  attributeValues,
  ...rest
}) => {
  const intl = useIntl();

  return (
    <AssignContainerDialog
      containers={attributeValues.map(value => ({
        id: value.value,
        name: value.label,
      }))}
      labels={{
        confirmBtn: intl.formatMessage(messages.confirmBtn),
        label: intl.formatMessage(messages.searchLabel),
        placeholder: intl.formatMessage(messages.searchPlaceholder),
        title: intl.formatMessage(messages.header),
      }}
      confirmButtonState="default"
      {...rest}
    />
  );
};

AssignAttributeValueDialog.displayName = "AssignAttributeValueDialog";
export default AssignAttributeValueDialog;
