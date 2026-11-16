import { MetadataDialog } from "@dashboard/components/MetadataDialog/MetadataDialog";
import { useHandleMetadataSubmit } from "@dashboard/components/MetadataDialog/useHandleMetadataSubmit";
import { useMetadataForm } from "@dashboard/components/MetadataDialog/useMetadataForm";
import { mapFieldArrayToMetadataInput } from "@dashboard/components/MetadataDialog/validation";
import { GiftCardDetailsDocument, type GiftCardDetailsQuery } from "@dashboard/graphql";
import { useEffect } from "react";
import { useIntl } from "react-intl";

type GiftCardMetadataDialogData = NonNullable<GiftCardDetailsQuery["giftCard"]>;

interface GiftCardMetadataDialogProps {
  open: boolean;
  onClose: () => void;
  giftCard: GiftCardMetadataDialogData | undefined | null;
}

export const GiftCardMetadataDialog = ({
  onClose,
  open,
  giftCard,
}: GiftCardMetadataDialogProps) => {
  const intl = useIntl();
  const normalizedGiftCard = giftCard
    ? { ...giftCard, privateMetadata: giftCard.privateMetadata ?? [] }
    : undefined;
  const { onSubmit, submitInProgress } = useHandleMetadataSubmit({
    initialData: normalizedGiftCard,
    onClose,
    refetchDocument: GiftCardDetailsDocument,
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
    baseline,
  } = useMetadataForm({
    graphqlData: normalizedGiftCard,
    submitInProgress,
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
        await onSubmit(formData, baseline);
      }}
      title={intl.formatMessage({
        defaultMessage: "Gift card metadata",
        description: "gift card metadata dialog header",
        id: "769/mX",
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
