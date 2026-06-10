import { MetadataDialog } from "@dashboard/components/MetadataDialog/MetadataDialog";
import { useHandleMetadataSubmit } from "@dashboard/components/MetadataDialog/useHandleMetadataSubmit";
import { useMetadataForm } from "@dashboard/components/MetadataDialog/useMetadataForm";
import { mapFieldArrayToMetadataInput } from "@dashboard/components/MetadataDialog/validation";
import { ProductMediaByIdDocument, type ProductMediaByIdQuery } from "@dashboard/graphql";
import { useEffect } from "react";
import { defineMessages, useIntl } from "react-intl";

type ProductMediaMetadataDialogData = NonNullable<
  NonNullable<ProductMediaByIdQuery["product"]>["mainImage"]
>;

interface ProductMediaMetadataDialogProps {
  open: boolean;
  onClose: () => void;
  media: ProductMediaMetadataDialogData | undefined | null;
}

const messages = defineMessages({
  title: {
    id: "2fZByy",
    defaultMessage: "Media Metadata",
    description: "product media metadata dialog header",
  },
});

export const ProductMediaMetadataDialog = ({
  onClose,
  open,
  media,
}: ProductMediaMetadataDialogProps) => {
  const intl = useIntl();
  const normalizedMedia = media
    ? { ...media, privateMetadata: media.privateMetadata ?? [] }
    : undefined;
  const { onSubmit, lastSubmittedData, submitInProgress } = useHandleMetadataSubmit({
    initialData: normalizedMedia,
    onClose,
    refetchDocument: ProductMediaByIdDocument,
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
