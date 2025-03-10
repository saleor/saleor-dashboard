// @ts-strict-ignore
import { CollectionWithTotalProductsFragment } from "@dashboard/graphql";
import React from "react";
import { useIntl } from "react-intl";

import AssignContainerDialog, { AssignContainerDialogProps } from "../AssignContainerDialog";
import { messages } from "./messages";

interface AssignCollectionDialogProps
  extends Omit<AssignContainerDialogProps, "containers" | "labels"> {
  collections: CollectionWithTotalProductsFragment[];
  labels?: Partial<AssignContainerDialogProps["labels"]>;
}

const AssignCollectionDialog: React.FC<AssignCollectionDialogProps> = ({
  collections,
  labels,
  ...rest
}) => {
  const intl = useIntl();

  return (
    <AssignContainerDialog
      containers={collections}
      labels={{
        title: intl.formatMessage(messages.assignCollectionDialogHeader),
        label: intl.formatMessage(messages.assignCollectionDialogLabel),
        placeholder: intl.formatMessage(messages.assignCollectionDialogPlaceholder),
        confirmBtn: intl.formatMessage(messages.confirmBtn),
        ...labels,
      }}
      {...rest}
    />
  );
};

AssignCollectionDialog.displayName = "AssignCollectionDialog";
export default AssignCollectionDialog;
