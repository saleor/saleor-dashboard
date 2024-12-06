// @ts-strict-ignore
import { SearchCategoriesQuery } from "@dashboard/graphql";
import { RelayToFlat } from "@dashboard/types";
import React from "react";
import { useIntl } from "react-intl";

import AssignContainerDialog, { AssignContainerDialogProps } from "../AssignContainerDialog";
import { messages } from "./messages";

interface AssignCategoryDialogProps
  extends Omit<AssignContainerDialogProps, "containers" | "labels"> {
  categories: RelayToFlat<SearchCategoriesQuery["search"]>;
}

const AssignCategoryDialog = ({ categories, ...rest }: AssignCategoryDialogProps) => {
  const intl = useIntl();

  return (
    <AssignContainerDialog
      containers={categories}
      labels={{
        title: intl.formatMessage(messages.assignCategoryDialogHeader),
        label: intl.formatMessage(messages.assignCategoryDialogLabel),
        placeholder: intl.formatMessage(messages.assignCategoryDialogPlaceholder),
        confirmBtn: intl.formatMessage(messages.confirmButton),
      }}
      {...rest}
    />
  );
};

AssignCategoryDialog.displayName = "AssignCategoryDialog";
export default AssignCategoryDialog;
