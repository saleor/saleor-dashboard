import { MetadataFormData } from "@dashboard/components/Metadata";
import { MetadataDialog } from "@dashboard/components/MetadataDialog/MetadataDialog";
import { useHandleMetadataSubmit } from "@dashboard/components/MetadataDialog/useHandleMetadataSubmit";
import { useMetadataFormControls } from "@dashboard/components/MetadataDialog/useMetadataFormControls";
import { mapFieldArrayToMetadataInput } from "@dashboard/components/MetadataDialog/validation";
import { OrderDetailsDocument, OrderDetailsFragment } from "@dashboard/graphql";
import { mapMetadataItemToInput } from "@dashboard/utils/maps";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
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

  const formMethods = useForm<MetadataFormData>({
    // Display last submitted data while re-fetching to avoid flicker on UI
    values: submitInProgress
      ? lastSubmittedData
      : {
          // Removes __typename from metadata item object
          metadata: (fulfillment?.metadata ?? []).map(mapMetadataItemToInput),
          privateMetadata: (fulfillment?.privateMetadata ?? []).map(mapMetadataItemToInput),
        },
  });

  const { control, getValues, formState, trigger, reset } = formMethods;

  const {
    metadataFields,
    privateMetadataFields,
    handleMetadataChange,
    handlePrivateMetadataChange,
    metadataErrors,
    privateMetadataErrors,
  } = useMetadataFormControls({
    control,
    trigger,
    getValues,
    formState,
  });

  // Change handlers
  const handleChange = (event: any, isPrivate: boolean) => {
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
      formIsDirty={formState.isDirty}
    />
  );
};
