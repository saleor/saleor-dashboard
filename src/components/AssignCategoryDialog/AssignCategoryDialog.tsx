import { SearchCategoriesQuery } from "@saleor/graphql";
import { RelayToFlat } from "@saleor/types";
import React from "react";
import { useIntl } from "react-intl";

import AssignContainerDialog, {
  AssignContainerDialogProps
} from "../AssignContainerDialog";
import { messages } from "./messages";

interface AssignCategoryDialogProps
  extends Omit<AssignContainerDialogProps, "containers" | "title" | "search"> {
  categories: RelayToFlat<SearchCategoriesQuery["search"]>;
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
        label: intl.formatMessage(messages.assignCategoryDialogLabel),
        placeholder: intl.formatMessage(
          messages.assignCategoryDialogPlaceholder
        )
      }}
      title={intl.formatMessage(messages.assignCategoryDialogHeader)}
      {...rest}
    />
  );
};

AssignCategoryDialog.displayName = "AssignCategoryDialog";
export default AssignCategoryDialog;
