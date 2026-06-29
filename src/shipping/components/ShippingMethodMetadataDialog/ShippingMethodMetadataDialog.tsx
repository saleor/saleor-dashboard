import { MetadataDialog } from "@dashboard/components/MetadataDialog/MetadataDialog";
import { useHandleMetadataSubmit } from "@dashboard/components/MetadataDialog/useHandleMetadataSubmit";
import { useMetadataForm } from "@dashboard/components/MetadataDialog/useMetadataForm";
import { mapFieldArrayToMetadataInput } from "@dashboard/components/MetadataDialog/validation";
import { ShippingZoneDocument, type ShippingZoneQuery } from "@dashboard/graphql";
import { useEffect } from "react";
import { useIntl } from "react-intl";

type ShippingMethodMetadataDialogData = NonNullable<
  NonNullable<ShippingZoneQuery["shippingZone"]>["shippingMethods"]
>[number];

interface ShippingMethodMetadataDialogProps {
  open: boolean;
  onClose: () => void;
  shippingMethod: ShippingMethodMetadataDialogData | undefined | null;
}

export const ShippingMethodMetadataDialog = ({
  onClose,
  open,
  shippingMethod,
}: ShippingMethodMetadataDialogProps) => {
  const intl = useIntl();
  const normalizedShippingMethod = shippingMethod
    ? { ...shippingMethod, privateMetadata: shippingMethod.privateMetadata ?? [] }
    : undefined;
  const { onSubmit, lastSubmittedData, submitInProgress } = useHandleMetadataSubmit({
    initialData: normalizedShippingMethod,
    onClose,
    refetchDocument: ShippingZoneDocument,
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
    graphqlData: normalizedShippingMethod,
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
        defaultMessage: "Shipping Method Metadata",
        description: "shipping method metadata dialog header",
        id: "NviQiO",
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

ShippingMethodMetadataDialog.displayName = "ShippingMethodMetadataDialog";
