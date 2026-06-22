import { type ApolloQueryResult } from "@apollo/client";
import { MetadataDialog } from "@dashboard/components/MetadataDialog/MetadataDialog";
import { useHandleMetadataSubmit } from "@dashboard/components/MetadataDialog/useHandleMetadataSubmit";
import { useMetadataForm } from "@dashboard/components/MetadataDialog/useMetadataForm";
import { mapFieldArrayToMetadataInput } from "@dashboard/components/MetadataDialog/validation";
import { AttributeDetailsDocument, type AttributeDetailsQuery } from "@dashboard/graphql";
import { mapMetadataItemToInput } from "@dashboard/utils/maps";
import { useEffect, useMemo, useRef } from "react";
import { useIntl } from "react-intl";

type AttributeMetadataDialogData = NonNullable<AttributeDetailsQuery["attribute"]>;

interface AttributeMetadataDialogProps {
  open: boolean;
  onClose: () => void;
  attribute: AttributeMetadataDialogData | undefined | null;
  refetchAttribute?: () => Promise<ApolloQueryResult<AttributeDetailsQuery>>;
}

export const AttributeMetadataDialog = ({
  onClose,
  open,
  attribute,
  refetchAttribute,
}: AttributeMetadataDialogProps) => {
  const intl = useIntl();
  const normalizedAttribute = useMemo(
    () =>
      attribute
        ? {
            ...attribute,
            metadata: attribute.metadata ?? [],
            privateMetadata: attribute.privateMetadata ?? [],
          }
        : undefined,
    [attribute],
  );
  const { onSubmit, lastSubmittedData, submitInProgress } = useHandleMetadataSubmit({
    initialData: normalizedAttribute,
    onClose,
    refetchDocument: AttributeDetailsDocument,
    refetch: refetchAttribute,
  });

  const {
    metadataFields,
    privateMetadataFields,
    metadataErrors,
    privateMetadataErrors,
    reset,
    formIsDirty,
    handleChange,
    getFormData,
  } = useMetadataForm({
    graphqlData: normalizedAttribute,
    submitInProgress,
    lastSubmittedData,
  });

  const wasOpenRef = useRef(false);

  useEffect(() => {
    if (!open) {
      wasOpenRef.current = false;
      reset();

      return;
    }

    if (!normalizedAttribute || wasOpenRef.current) {
      return;
    }

    reset({
      metadata: normalizedAttribute.metadata.map(mapMetadataItemToInput),
      privateMetadata: normalizedAttribute.privateMetadata.map(mapMetadataItemToInput),
    });
    wasOpenRef.current = true;
  }, [open, normalizedAttribute, reset]);

  return (
    <MetadataDialog
      open={open}
      onClose={onClose}
      onSave={async () => {
        await onSubmit(getFormData());
      }}
      title={intl.formatMessage({
        defaultMessage: "Attribute Metadata",
        description: "attribute metadata dialog header",
        id: "YNUHeb",
      })}
      data={{
        metadata: mapFieldArrayToMetadataInput(metadataFields),
        privateMetadata: mapFieldArrayToMetadataInput(privateMetadataFields),
      }}
      onChange={handleChange}
      loading={submitInProgress}
      errors={{
        metadata: metadataErrors.length ? metadataErrors.join(", ") : undefined,
        privateMetadata: privateMetadataErrors.length
          ? privateMetadataErrors.join(", ")
          : undefined,
      }}
      formIsDirty={formIsDirty}
    />
  );
};
