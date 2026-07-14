import { type ApolloQueryResult } from "@apollo/client";
import { MetadataDialog } from "@dashboard/components/MetadataDialog/MetadataDialog";
import { useHandleMetadataSubmit } from "@dashboard/components/MetadataDialog/useHandleMetadataSubmit";
import { useMetadataForm } from "@dashboard/components/MetadataDialog/useMetadataForm";
import { mapFieldArrayToMetadataInput } from "@dashboard/components/MetadataDialog/validation";
import { ProductTypeDetailsDocument, type ProductTypeDetailsQuery } from "@dashboard/graphql";
import { mapMetadataItemToInput } from "@dashboard/utils/maps";
import { useEffect, useMemo, useRef } from "react";
import { useIntl } from "react-intl";

type ProductTypeMetadataDialogData = NonNullable<ProductTypeDetailsQuery["productType"]>;

interface ProductTypeMetadataDialogProps {
  open: boolean;
  onClose: () => void;
  productType: ProductTypeMetadataDialogData | undefined | null;
  refetchProductType?: () => Promise<ApolloQueryResult<ProductTypeDetailsQuery>>;
}

export const ProductTypeMetadataDialog = ({
  onClose,
  open,
  productType,
  refetchProductType,
}: ProductTypeMetadataDialogProps) => {
  const intl = useIntl();
  const normalizedProductType = useMemo(
    () =>
      productType
        ? {
            ...productType,
            metadata: productType.metadata ?? [],
            privateMetadata: productType.privateMetadata ?? [],
          }
        : undefined,
    [productType],
  );
  const { onSubmit, lastSubmittedData, submitInProgress } = useHandleMetadataSubmit({
    initialData: normalizedProductType,
    onClose,
    refetchDocument: ProductTypeDetailsDocument,
    refetch: refetchProductType,
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
    graphqlData: normalizedProductType,
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

    if (!normalizedProductType || wasOpenRef.current) {
      return;
    }

    reset({
      metadata: normalizedProductType.metadata.map(mapMetadataItemToInput),
      privateMetadata: normalizedProductType.privateMetadata.map(mapMetadataItemToInput),
    });
    wasOpenRef.current = true;
  }, [open, normalizedProductType, reset]);

  return (
    <MetadataDialog
      open={open}
      onClose={onClose}
      onSave={async () => {
        await onSubmit(getFormData());
      }}
      title={intl.formatMessage({
        defaultMessage: "Product Type Metadata",
        description: "product type metadata dialog header",
        id: "VxRMgP",
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
