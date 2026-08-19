import { MetadataDialog } from "@dashboard/components/MetadataDialog/MetadataDialog";
import { useHandleMetadataSubmit } from "@dashboard/components/MetadataDialog/useHandleMetadataSubmit";
import { useMetadataForm } from "@dashboard/components/MetadataDialog/useMetadataForm";
import { mapFieldArrayToMetadataInput } from "@dashboard/components/MetadataDialog/validation";
import { ChannelDocument, type ChannelQuery } from "@dashboard/graphql";
import { useEffect } from "react";
import { useIntl } from "react-intl";

type ChannelMetadataDialogData = NonNullable<ChannelQuery["channel"]>;

interface ChannelMetadataDialogProps {
  open: boolean;
  onClose: () => void;
  channel: ChannelMetadataDialogData | undefined | null;
}

export const ChannelMetadataDialog = ({ onClose, open, channel }: ChannelMetadataDialogProps) => {
  const intl = useIntl();
  const { onSubmit, lastSubmittedData, submitInProgress } = useHandleMetadataSubmit({
    initialData: channel ?? undefined,
    onClose,
    refetchDocument: ChannelDocument,
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
    graphqlData: channel ?? undefined,
    submitInProgress,
    lastSubmittedData,
  });

  useEffect(
    function resetMetadataFormWhenDialogCloses() {
      if (!open) {
        reset();
      }
    },
    [open, reset],
  );

  return (
    <MetadataDialog
      open={open}
      onClose={onClose}
      onSave={async () => {
        await onSubmit(formData);
      }}
      title={intl.formatMessage({
        defaultMessage: "Channel Metadata",
        description: "channel metadata dialog header",
        id: "2qyiGa",
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
