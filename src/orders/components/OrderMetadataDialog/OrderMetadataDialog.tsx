import { MetadataFormData } from "@dashboard/components/Metadata";
import { MetadataDialog, useHandleMetadataSubmit } from "@dashboard/components/MetadataDialog";
import { useMetadataFormControls } from "@dashboard/components/MetadataDialog/useMetadataFormControls";
import { mapFieldArrayToMetadataInput } from "@dashboard/components/MetadataDialog/validation";
import { OrderDetailsDocument, OrderDetailsQuery } from "@dashboard/graphql";
import { ChangeEvent } from "@dashboard/hooks/useForm";
import { mapMetadataItemToInput } from "@dashboard/utils/maps";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useIntl } from "react-intl";

export type OrderMetadataDialogData = NonNullable<OrderDetailsQuery["order"]>;

interface OrderMetadataDialogProps {
  open: boolean;
  onClose: () => void;
  order: OrderMetadataDialogData | undefined;
}

export const OrderMetadataDialog = ({ onClose, open, order }: OrderMetadataDialogProps) => {
  const intl = useIntl();
  const { onSubmit, lastSubmittedData, submitInProgress } = useHandleMetadataSubmit({
    initialData: order,
    onClose,
    refetchDocument: OrderDetailsDocument,
  });

  const formMethods = useForm<MetadataFormData>({
    // Display last submitted data while re-fetching to avoid flicker on UI
    values: submitInProgress
      ? lastSubmittedData
      : {
          // Removes __typename from metadata item object
          metadata: (order?.metadata ?? []).map(mapMetadataItemToInput),
          privateMetadata: (order?.privateMetadata ?? []).map(mapMetadataItemToInput),
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
        defaultMessage: "Order Metadata",
        id: "oL7VUz",
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
