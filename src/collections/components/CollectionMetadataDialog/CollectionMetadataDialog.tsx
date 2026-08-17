import { MetadataDialog } from "@dashboard/components/MetadataDialog/MetadataDialog";
import { useHandleMetadataSubmit } from "@dashboard/components/MetadataDialog/useHandleMetadataSubmit";
import { useMetadataForm } from "@dashboard/components/MetadataDialog/useMetadataForm";
import { mapFieldArrayToMetadataInput } from "@dashboard/components/MetadataDialog/validation";
import { CollectionDetailsDocument, type CollectionDetailsQuery } from "@dashboard/graphql";
import { useEffect } from "react";
import { useIntl } from "react-intl";

type CollectionMetadataDialogData = NonNullable<CollectionDetailsQuery["collection"]>;

interface CollectionMetadataDialogProps {
  open: boolean;
  onClose: () => void;
  collection: CollectionMetadataDialogData | undefined | null;
}

export const CollectionMetadataDialog = ({
  onClose,
  open,
  collection,
}: CollectionMetadataDialogProps) => {
  const intl = useIntl();
  const normalizedCollection = collection
    ? { ...collection, privateMetadata: collection.privateMetadata ?? [] }
    : undefined;
  const { onSubmit, lastSubmittedData, submitInProgress } = useHandleMetadataSubmit({
    initialData: normalizedCollection,
    onClose,
    refetchDocument: CollectionDetailsDocument,
  });

  const {
    metadataFields,
    privateMetadataFields,
    metadataErrors,
    privateMetadataErrors,
    reset,
    formIsDirty,
    handleChange,
    formData,
  } = useMetadataForm({
    graphqlData: normalizedCollection,
    submitInProgress,
    lastSubmittedData,
  });

  useEffect(() => {
    if (!open) {
      reset();
    }
  }, [open, reset]);

  return (
    <MetadataDialog
      open={open}
      onClose={onClose}
      onSave={async () => {
        await onSubmit(formData);
      }}
      title={intl.formatMessage({
        defaultMessage: "Collection Metadata",
        description: "collection metadata dialog header",
        id: "K0Scar",
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
