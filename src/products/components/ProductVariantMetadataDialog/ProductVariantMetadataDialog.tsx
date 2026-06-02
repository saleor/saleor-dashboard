import { MetadataDialog } from "@dashboard/components/MetadataDialog/MetadataDialog";
import { useHandleMetadataSubmit } from "@dashboard/components/MetadataDialog/useHandleMetadataSubmit";
import { useMetadataForm } from "@dashboard/components/MetadataDialog/useMetadataForm";
import { mapFieldArrayToMetadataInput } from "@dashboard/components/MetadataDialog/validation";
import { ProductVariantDetailsDocument, type ProductVariantDetailsQuery } from "@dashboard/graphql";
import { useEffect } from "react";
import { useIntl } from "react-intl";

type ProductVariantMetadataDialogData = NonNullable<ProductVariantDetailsQuery["productVariant"]>;

interface ProductVariantMetadataDialogProps {
  open: boolean;
  onClose: () => void;
  variant: ProductVariantMetadataDialogData | undefined | null;
}

export const ProductVariantMetadataDialog = ({
  onClose,
  open,
  variant,
}: ProductVariantMetadataDialogProps) => {
  const intl = useIntl();
  const normalizedVariant = variant
    ? { ...variant, privateMetadata: variant.privateMetadata ?? [] }
    : undefined;
  const { onSubmit, lastSubmittedData, submitInProgress } = useHandleMetadataSubmit({
    initialData: normalizedVariant,
    onClose,
    refetchDocument: ProductVariantDetailsDocument,
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
    graphqlData: normalizedVariant,
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
        defaultMessage: "Variant Metadata",
        description: "product variant metadata dialog header",
        id: "XP5btK",
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
