// @ts-strict-ignore
import { CategoryWithTotalProductsFragment } from "@dashboard/graphql";
import React from "react";
import { useIntl } from "react-intl";

import AssignContainerDialog, { AssignContainerDialogProps } from "../AssignContainerDialog";
import { messages } from "./messages";

interface AssignCategoryDialogProps
  extends Omit<AssignContainerDialogProps, "containers" | "labels"> {
  categories: CategoryWithTotalProductsFragment[];
  labels?: Partial<AssignContainerDialogProps["labels"]>;
}

const AssignCategoryDialog: React.FC<AssignCategoryDialogProps> = ({
  categories,
  labels,
  ...rest
}) => {
  const intl = useIntl();

  return (
    <AssignContainerDialog
      containers={categories}
      labels={{
        title: intl.formatMessage(messages.assignCategoryDialogHeader),
        label: intl.formatMessage(messages.assignCategoryDialogLabel),
        placeholder: intl.formatMessage(messages.assignCategoryDialogPlaceholder),
        confirmBtn: intl.formatMessage(messages.confirmButton),
        ...labels,
      }}
      {...rest}
    />
  );
};

AssignCategoryDialog.displayName = "AssignCategoryDialog";
export default AssignCategoryDialog;
