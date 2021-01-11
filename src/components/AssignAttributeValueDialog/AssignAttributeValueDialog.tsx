import { SearchPages_search_edges_node } from "@saleor/searches/types/SearchPages";
import React from "react";
import { defineMessages, useIntl } from "react-intl";

import AssignContainerDialog, {
  AssignContainerDialogProps
} from "../AssignContainerDialog";

const messages = defineMessages({
  header: {
    defaultMessage: "Assign Attribute Value",
    description: "dialog header"
  },
  searchLabel: {
    defaultMessage: "Search Attribute Value",
    description: "label"
  },
  searchPlaceholder: {
    defaultMessage: "Search by value name, etc...",
    description: "placeholder"
  }
});

interface AssignAttributeValueDialogProps
  extends Omit<
    AssignContainerDialogProps,
    "containers" | "title" | "search" | "confirmButtonState"
  > {
  attributeValues: SearchPages_search_edges_node[];
}

const AssignAttributeValueDialog: React.FC<AssignAttributeValueDialogProps> = ({
  attributeValues,
  ...rest
}) => {
  const intl = useIntl();

  return (
    <AssignContainerDialog
      containers={attributeValues.map(value => ({
        id: value.id,
        name: value.title
      }))}
      search={{
        label: intl.formatMessage(messages.searchLabel),
        placeholder: intl.formatMessage(messages.searchPlaceholder)
      }}
      title={intl.formatMessage(messages.header)}
      confirmButtonState="default"
      {...rest}
    />
  );
};

AssignAttributeValueDialog.displayName = "AssignAttributeValueDialog";
export default AssignAttributeValueDialog;
