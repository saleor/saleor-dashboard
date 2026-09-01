import { MetadataDialog } from "@dashboard/components/MetadataDialog/MetadataDialog";
import { useHandleMetadataSubmit } from "@dashboard/components/MetadataDialog/useHandleMetadataSubmit";
import { useMetadataForm } from "@dashboard/components/MetadataDialog/useMetadataForm";
import { mapFieldArrayToMetadataInput } from "@dashboard/components/MetadataDialog/validation";
import { type MetadataItemFragment } from "@dashboard/graphql";
import { type DocumentNode } from "graphql";
import { useEffect } from "react";
import { defineMessages, useIntl } from "react-intl";

interface MediaMetadataDialogData {
  id: string;
  metadata: MetadataItemFragment[];
  privateMetadata?: MetadataItemFragment[] | null;
}

interface MediaMetadataDialogProps {
  open: boolean;
  onClose: () => void;
  media: MediaMetadataDialogData | undefined | null;
  /** Query re-run after a successful save so the dialog reopens with fresh values. */
  refetchDocument: DocumentNode;
}

const messages = defineMessages({
  title: {
    id: "2fZByy",
    defaultMessage: "Media Metadata",
    description: "product media metadata dialog header",
  },
});

export const MediaMetadataDialog = ({
  onClose,
  open,
  media,
  refetchDocument,
}: MediaMetadataDialogProps) => {
  const intl = useIntl();
  const normalizedMedia = media
    ? { ...media, privateMetadata: media.privateMetadata ?? [] }
    : undefined;
  const { onSubmit, lastSubmittedData, submitInProgress } = useHandleMetadataSubmit({
    initialData: normalizedMedia,
    onClose,
    refetchDocument,
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
    graphqlData: normalizedMedia,
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
      title={intl.formatMessage(messages.title)}
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

MediaMetadataDialog.displayName = "MediaMetadataDialog";
