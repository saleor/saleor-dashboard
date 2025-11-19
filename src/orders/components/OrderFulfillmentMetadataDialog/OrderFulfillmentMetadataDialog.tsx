import { MetadataDialog } from "@dashboard/components/MetadataDialog/MetadataDialog";
import { useHandleMetadataSubmit } from "@dashboard/components/MetadataDialog/useHandleMetadataSubmit";
import { useMetadataForm } from "@dashboard/components/MetadataDialog/useMetadataForm";
import { mapFieldArrayToMetadataInput } from "@dashboard/components/MetadataDialog/validation";
import { OrderDetailsDocument, OrderDetailsFragment } from "@dashboard/graphql";
import { ChangeEvent } from "@dashboard/hooks/useForm";
import { useEffect } from "react";
import { useIntl } from "react-intl";

export type FulfillmentMetadataDialogData = OrderDetailsFragment["fulfillments"][0];

interface OrderFulfillmentMetadataDialogProps {
  open: boolean;
  onClose: () => void;
  fulfillment: FulfillmentMetadataDialogData | undefined;
}

export const OrderFulfillmentMetadataDialog = ({
  onClose,
  open,
  fulfillment,
}: OrderFulfillmentMetadataDialogProps) => {
  const intl = useIntl();
  const { onSubmit, lastSubmittedData, submitInProgress } = useHandleMetadataSubmit({
    initialData: fulfillment,
    onClose,
    refetchDocument: OrderDetailsDocument,
  });

  const {
    metadataFields,
    privateMetadataFields,
    handleMetadataChange,
    handlePrivateMetadataChange,
    metadataErrors,
    privateMetadataErrors,
    reset,
    getValues,
    formIsDirty,
  } = useMetadataForm({
    entityData: fulfillment,
    submitInProgress,
    lastSubmittedData,
  });

  // Unified change handler for MetadataDialog component
  const handleChange = (event: ChangeEvent, isPrivate: boolean): void => {
    if (isPrivate) {
      handlePrivateMetadataChange(event);
    } else {
      handleMetadataChange(event);
    }
  };

  useEffect(() => {
    if (!open) {
      reset();
    }
  }, [open, reset]);

  const handleSave = async () => {
    const formData = getValues();

    await onSubmit(formData);
  };

  return (
    <MetadataDialog
      open={open}
      onClose={onClose}
      onSave={handleSave}
      title={intl.formatMessage({
        defaultMessage: "Fulfillment Metadata",
        id: "lDdWo9",
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
