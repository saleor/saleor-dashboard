import { MetadataFormData } from "@dashboard/components/Metadata";
import { MetadataDialog } from "@dashboard/components/MetadataDialog";
import { useMetadataFormControls } from "@dashboard/components/MetadataDialog/useMetadataFormControls";
import { OrderDetailsWithMetadataQuery } from "@dashboard/graphql";
import { mapMetadataItemToInput } from "@dashboard/utils/maps";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { FormattedMessage } from "react-intl";

import { useHandleOrderMetadataSubmit } from "./useHandleSubmit";

export type OrderMetadataDialogData = NonNullable<OrderDetailsWithMetadataQuery["order"]>;

interface OrderMetadataDialogProps {
  open: boolean;
  onClose: () => void;
  orderId: string;
  data: OrderMetadataDialogData | undefined;
  loading: boolean;
}

export const OrderMetadataDialog = ({
  onClose,
  open,
  orderId: _orderId,
  data,
  loading,
}: OrderMetadataDialogProps) => {
  const { onSubmit, lastSubmittedData, submitInProgress } = useHandleOrderMetadataSubmit({
    initialData: data,
    onClose,
  });

  const formMethods = useForm<MetadataFormData>({
    // Display last submitted data while re-fetching to avoid flicker on UI
    values:
      submitInProgress && lastSubmittedData
        ? lastSubmittedData
        : {
            // Removes __typename from metadata item object
            metadata: (data?.metadata ?? []).map(mapMetadataItemToInput),
            privateMetadata: (data?.privateMetadata ?? [])?.map(mapMetadataItemToInput),
          },
  });

  const { handleSubmit, control, getValues, formState, trigger, reset } = formMethods;

  const {
    metadataFields,
    privateMetadataFields,
    handleMetadataChange,
    handlePrivateMetadataChange,
    metadataErrors,
    privateMetadataErrors,
  } = useMetadataFormControls({ control, trigger, getValues, formState });

  useEffect(() => {
    if (!open) {
      reset();
    }
  }, [open, reset]);

  return (
    <MetadataDialog
      open={open}
      onClose={onClose}
      onSubmit={handleSubmit(onSubmit)}
      title={
        <FormattedMessage
          defaultMessage="Order metadata"
          description="dialog title, editing order metadata"
          id="zsCVOL"
        />
      }
      loading={loading}
      submitInProgress={submitInProgress}
      isDirty={formState.isDirty}
      metadataFields={metadataFields}
      privateMetadataFields={privateMetadataFields}
      handleMetadataChange={handleMetadataChange}
      handlePrivateMetadataChange={handlePrivateMetadataChange}
      metadataErrors={metadataErrors}
      privateMetadataErrors={privateMetadataErrors}
    />
  );
};
