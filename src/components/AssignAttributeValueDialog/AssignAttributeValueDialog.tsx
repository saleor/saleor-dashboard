import { SearchPages_search_edges_node } from "@saleor/searches/types/SearchPages";
import React from "react";
import { useIntl } from "react-intl";

import AssignContainerDialog, {
  AssignContainerDialogProps
} from "../AssignContainerDialog";

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
        label: intl.formatMessage({
          defaultMessage: "Search Attribute Value"
        }),
        placeholder: intl.formatMessage({
          defaultMessage: "Search by value name, etc..."
        })
      }}
      title={intl.formatMessage({
        defaultMessage: "Assign Attribute Value",
        description: "dialog header"
      })}
      confirmButtonState="default"
      {...rest}
    />
  );
};

AssignAttributeValueDialog.displayName = "AssignAttributeValueDialog";
export default AssignAttributeValueDialog;
