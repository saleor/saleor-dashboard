import { MetadataDialog } from "@dashboard/components/MetadataDialog/MetadataDialog";
import { useHandleMetadataSubmit } from "@dashboard/components/MetadataDialog/useHandleMetadataSubmit";
import { useMetadataForm } from "@dashboard/components/MetadataDialog/useMetadataForm";
import { mapFieldArrayToMetadataInput } from "@dashboard/components/MetadataDialog/validation";
import { CustomerDetailsDocument, type CustomerDetailsQuery } from "@dashboard/graphql";
import { useEffect } from "react";
import { useIntl } from "react-intl";

type CustomerMetadataDialogData = NonNullable<CustomerDetailsQuery["user"]>;

interface CustomerMetadataDialogProps {
  open: boolean;
  onClose: () => void;
  customer: CustomerMetadataDialogData | undefined | null;
}

export const CustomerMetadataDialog = ({
  onClose,
  open,
  customer,
}: CustomerMetadataDialogProps) => {
  const intl = useIntl();
  // `privateMetadata` is `@include(if: $PERMISSION_MANAGE_STAFF)` on the
  // customer query, so it's optional on the fragment. Coalesce to `[]` to
  // satisfy the metadata-form contract, which expects both arrays present.
  const normalizedCustomer = customer
    ? { ...customer, privateMetadata: customer.privateMetadata ?? [] }
    : undefined;
  const { onSubmit, lastSubmittedData, submitInProgress } = useHandleMetadataSubmit({
    initialData: normalizedCustomer,
    onClose,
    refetchDocument: CustomerDetailsDocument,
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
    graphqlData: normalizedCustomer,
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
        defaultMessage: "Customer Metadata",
        description: "customer metadata dialog header",
        id: "w4TUT+",
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
