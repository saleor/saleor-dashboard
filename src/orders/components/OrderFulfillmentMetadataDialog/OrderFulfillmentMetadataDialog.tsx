import { MetadataDialog } from "@dashboard/components/MetadataDialog/MetadataDialog";
import { useHandleMetadataSubmit } from "@dashboard/components/MetadataDialog/useHandleMetadataSubmit";
import { useMetadataForm } from "@dashboard/components/MetadataDialog/useMetadataForm";
import { mapFieldArrayToMetadataInput } from "@dashboard/components/MetadataDialog/validation";
import { OrderFulfillmentMetadataDocument } from "@dashboard/graphql";
import { useEffect } from "react";
import { useIntl } from "react-intl";

import { useFulfillmentMetadataValues } from "./useFulfillmentMetadataValues";

interface OrderFulfillmentMetadataDialogProps {
  open: boolean;
  onClose: () => void;
  orderId: string;
  fulfillmentId: string;
}

export const OrderFulfillmentMetadataDialog = ({
  onClose,
  open,
  orderId,
  fulfillmentId,
}: OrderFulfillmentMetadataDialogProps) => {
  const intl = useIntl();
  const { data: fulfillment } = useFulfillmentMetadataValues({
    orderId,
    fulfillmentId,
    open,
  });
  const { onSubmit, lastSubmittedData, submitInProgress } = useHandleMetadataSubmit({
    initialData: fulfillment,
    onClose,
    refetchDocument: OrderFulfillmentMetadataDocument,
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
    graphqlData: fulfillment,
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
        defaultMessage: "Fulfillment Metadata",
        id: "lDdWo9",
      })}
      data={{
        metadata: mapFieldArrayToMetadataInput(metadataFields),
        privateMetadata: mapFieldArrayToMetadataInput(privateMetadataFields),
      }}
      onChange={handleChange}
      loading={submitInProgress}
      contentLoading={open && !fulfillment}
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
