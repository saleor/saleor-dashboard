import { SearchCategories_search_edges_node } from "@saleor/searches/types/SearchCategories";
import React from "react";
import { useIntl } from "react-intl";

import AssignContainerDialog, {
  AssignContainerDialogProps
} from "../AssignContainerDialog";

interface AssignCategoryDialogProps
  extends Omit<AssignContainerDialogProps, "containers" | "title" | "search"> {
  categories: SearchCategories_search_edges_node[];
}

const AssignCategoryDialog: React.FC<AssignCategoryDialogProps> = ({
  categories,
  ...rest
}) => {
  const intl = useIntl();

  return (
    <AssignContainerDialog
      containers={categories}
      search={{
        label: intl.formatMessage({
          defaultMessage: "Search Category"
        }),
        placeholder: intl.formatMessage({
          defaultMessage: "Search by category name, etc..."
        })
      }}
      title={intl.formatMessage({
        defaultMessage: "Assign Category",
        description: "dialog header"
      })}
      {...rest}
    />
  );
};

AssignCategoryDialog.displayName = "AssignCategoryDialog";
export default AssignCategoryDialog;
