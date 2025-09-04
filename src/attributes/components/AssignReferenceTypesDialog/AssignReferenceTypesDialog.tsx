import AssignContainerDialog, {
  AssignContainerDialogProps,
} from "@dashboard/components/AssignContainerDialog";
import React from "react";
import { useIntl } from "react-intl";

import { messages } from "./messages";


type ReferenceTypes = { id: string; name: string }[];

interface AssignCollectionDialogProps
  extends Omit<AssignContainerDialogProps, "containers" | "labels"> {
  referenceTypes: ReferenceTypes | null;
  labels?: Partial<AssignContainerDialogProps["labels"]>;
}

const AssignReferenceTypesDialog = ({ referenceTypes, labels, ...rest }: AssignCollectionDialogProps) => {
  const intl = useIntl();

  return (
    <AssignContainerDialog
      containers={referenceTypes}
      labels={{
        title: intl.formatMessage(messages.titleProductTypes),
        label: intl.formatMessage(messages.searchLabel),
        placeholder: intl.formatMessage(messages.searchPlaceholder),
        confirmBtn: intl.formatMessage(messages.confirmBtn),
        ...labels,
      }}
      {...rest}
    />
  );
};

AssignReferenceTypesDialog.displayName = "AssignReferenceTypesDialog";
export default AssignReferenceTypesDialog;
