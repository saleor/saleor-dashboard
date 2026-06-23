import { MetadataDialog } from "@dashboard/components/MetadataDialog/MetadataDialog";
import { useHandleMetadataSubmit } from "@dashboard/components/MetadataDialog/useHandleMetadataSubmit";
import { useMetadataForm } from "@dashboard/components/MetadataDialog/useMetadataForm";
import { mapFieldArrayToMetadataInput } from "@dashboard/components/MetadataDialog/validation";
import { ShippingZoneDocument, type ShippingZoneQuery } from "@dashboard/graphql";
import { useEffect } from "react";
import { useIntl } from "react-intl";

type ShippingZoneMetadataDialogData = NonNullable<ShippingZoneQuery["shippingZone"]>;

interface ShippingZoneMetadataDialogProps {
  open: boolean;
  onClose: () => void;
  shippingZone: ShippingZoneMetadataDialogData | undefined | null;
}

export const ShippingZoneMetadataDialog = ({
  onClose,
  open,
  shippingZone,
}: ShippingZoneMetadataDialogProps) => {
  const intl = useIntl();
  const normalizedShippingZone = shippingZone
    ? { ...shippingZone, privateMetadata: shippingZone.privateMetadata ?? [] }
    : undefined;
  const { onSubmit, lastSubmittedData, submitInProgress } = useHandleMetadataSubmit({
    initialData: normalizedShippingZone,
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
    graphqlData: normalizedShippingZone,
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
        defaultMessage: "Shipping Zone Metadata",
        description: "shipping zone metadata dialog header",
        id: "R+owWj",
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
