import AssignContainerDialog, {
  AssignContainerDialogProps,
} from "@dashboard/components/AssignContainerDialog";
import { AttributeEntityTypeEnum } from "@dashboard/graphql";
import { useIntl } from "react-intl";

import { messages } from "./messages";

export type ReferenceTypes = { id: string; name: string }[];

interface AssignCollectionDialogProps
  extends Omit<AssignContainerDialogProps, "containers" | "labels"> {
  selectedReferenceTypesIds: string[];
  referenceTypes: ReferenceTypes;
  entityType: AttributeEntityTypeEnum | null;
  labels?: Partial<AssignContainerDialogProps["labels"]>;
}

export const AssignReferenceTypesDialog = ({
  selectedReferenceTypesIds,
  referenceTypes,
  entityType,
  labels,
  ...rest
}: AssignCollectionDialogProps) => {
  const intl = useIntl();

  const filteredReferenceTypes = referenceTypes.filter(
    type => !selectedReferenceTypesIds.includes(type.id),
  );

  const title =
    entityType === AttributeEntityTypeEnum.PAGE
      ? intl.formatMessage(messages.titleModelTypes)
      : intl.formatMessage(messages.titleProductTypes);

  return (
    <AssignContainerDialog
      // Force react re-render to clear selected reference types when changing entity type
      // Should be removed after moving the selectedContainers outside AssignContainerDialog
      key={entityType}
      containers={filteredReferenceTypes}
      selectionMode="multiple"
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
