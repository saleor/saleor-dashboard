import { SearchCategoriesQuery } from "@saleor/graphql";
import { RelayToFlat } from "@saleor/types";
import React from "react";
import { useIntl } from "react-intl";

import AssignContainerDialog, {
  AssignContainerDialogProps,
} from "../AssignContainerDialog";
import { messages } from "./messages";

interface AssignCategoryDialogProps
  extends Omit<AssignContainerDialogProps, "containers" | "labels"> {
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
      labels={{
        title: intl.formatMessage(messages.assignCategoryDialogHeader),
        label: intl.formatMessage(messages.assignCategoryDialogLabel),
        placeholder: intl.formatMessage(
          messages.assignCategoryDialogPlaceholder,
        ),
        confirmBtn: intl.formatMessage(messages.confirmButton),
      }}
      {...rest}
    />
  );
};

AssignCategoryDialog.displayName = "AssignCategoryDialog";
export default AssignCategoryDialog;
