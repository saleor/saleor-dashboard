import { MetadataDialog } from "@dashboard/components/MetadataDialog/MetadataDialog";
import { useHandleMetadataSubmit } from "@dashboard/components/MetadataDialog/useHandleMetadataSubmit";
import { useMetadataForm } from "@dashboard/components/MetadataDialog/useMetadataForm";
import { mapFieldArrayToMetadataInput } from "@dashboard/components/MetadataDialog/validation";
import { PageDetailsDocument, type PageDetailsFragment } from "@dashboard/graphql";
import { useEffect } from "react";
import { useIntl } from "react-intl";

interface PageMetadataDialogProps {
  open: boolean;
  onClose: () => void;
  page: PageDetailsFragment | undefined | null;
}

export const PageMetadataDialog = ({ onClose, open, page }: PageMetadataDialogProps) => {
  const intl = useIntl();
  const normalizedPage = page
    ? { ...page, privateMetadata: page.privateMetadata ?? [] }
    : undefined;
  const { onSubmit, lastSubmittedData, submitInProgress } = useHandleMetadataSubmit({
    initialData: normalizedPage,
    onClose,
    refetchDocument: PageDetailsDocument,
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
    graphqlData: normalizedPage,
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
        defaultMessage: "Model Metadata",
        description: "model metadata dialog header",
        id: "uCJ+gT",
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
