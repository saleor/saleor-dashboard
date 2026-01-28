import { MetadataDialog } from "@dashboard/components/MetadataDialog/MetadataDialog";
import { useHandleMetadataSubmit } from "@dashboard/components/MetadataDialog/useHandleMetadataSubmit";
import { useMetadataForm } from "@dashboard/components/MetadataDialog/useMetadataForm";
import { mapFieldArrayToMetadataInput } from "@dashboard/components/MetadataDialog/validation";
import { WarehouseDetailsDocument, WarehouseDetailsFragment } from "@dashboard/graphql";
import { useEffect } from "react";
import { useIntl } from "react-intl";

interface WarehouseMetadataDialogProps {
  open: boolean;
  onClose: () => void;
  warehouse: WarehouseDetailsFragment | undefined;
}

export const WarehouseMetadataDialog = ({
  onClose,
  open,
  warehouse,
}: WarehouseMetadataDialogProps) => {
  const intl = useIntl();
  const { onSubmit, lastSubmittedData, submitInProgress } = useHandleMetadataSubmit({
    initialData: warehouse,
    onClose,
    refetchDocument: WarehouseDetailsDocument,
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
    graphqlData: warehouse,
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
        defaultMessage: "Warehouse Metadata",
        id: "zo5aT3",
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
