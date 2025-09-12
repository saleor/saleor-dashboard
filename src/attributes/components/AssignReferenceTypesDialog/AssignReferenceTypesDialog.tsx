import AssignContainerDialog, {
  AssignContainerDialogProps,
} from "@dashboard/components/AssignContainerDialog";
import React from "react";
import { useIntl } from "react-intl";

import { messages } from "./messages";

export type ReferenceTypes = { id: string; name: string }[];

interface AssignCollectionDialogProps
  extends Omit<AssignContainerDialogProps, "containers" | "labels"> {
  selectedReferenceTypesIds: string[];
  referenceTypes: ReferenceTypes;
  title: string;
  labels?: Partial<AssignContainerDialogProps["labels"]>;
}

export const AssignReferenceTypesDialog = ({
  selectedReferenceTypesIds,
  referenceTypes,
  title,
  labels,
  ...rest
}: AssignCollectionDialogProps) => {
  const intl = useIntl();
  const filteredReferenceTypes = referenceTypes.filter(
    type => !selectedReferenceTypesIds.includes(type.id),
  );

  return (
    <AssignContainerDialog
      containers={filteredReferenceTypes}
      labels={{
        title: title,
        label: intl.formatMessage(messages.searchLabel),
        placeholder: intl.formatMessage(messages.searchPlaceholder),
        confirmBtn: intl.formatMessage(messages.confirmBtn),
        ...labels,
      }}
      {...rest}
    />
  );
};
