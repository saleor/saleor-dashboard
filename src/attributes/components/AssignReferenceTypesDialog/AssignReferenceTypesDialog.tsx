import AssignContainerDialog, {
  AssignContainerDialogProps,
} from "@dashboard/components/AssignContainerDialog";
import React from "react";
import { useIntl } from "react-intl";

import { messages } from "./messages";


type ReferenceTypes = { id: string; name: string }[];

interface AssignCollectionDialogProps
  extends Omit<AssignContainerDialogProps, "containers" | "labels"> {
  selectedReferenceTypesIds: string[];
  referenceTypes: ReferenceTypes | null;
  labels?: Partial<AssignContainerDialogProps["labels"]>;
}

const AssignReferenceTypesDialog = ({ referenceTypes, labels, selectedReferenceTypesIds, ...rest }: AssignCollectionDialogProps) => {
  const intl = useIntl();
  const filteredReferenceTypes = referenceTypes?.filter(type => !selectedReferenceTypesIds.includes(type.id));

  return (
    <AssignContainerDialog
      containers={filteredReferenceTypes}
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
