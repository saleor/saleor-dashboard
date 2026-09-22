import { type ApolloQueryResult } from "@apollo/client";
import { MetadataDialog } from "@dashboard/components/MetadataDialog/MetadataDialog";
import { useHandleMetadataSubmit } from "@dashboard/components/MetadataDialog/useHandleMetadataSubmit";
import { useMetadataForm } from "@dashboard/components/MetadataDialog/useMetadataForm";
import { mapFieldArrayToMetadataInput } from "@dashboard/components/MetadataDialog/validation";
import {
  CustomerTypeDetailsDocument,
  type CustomerTypeDetailsFragment,
  type CustomerTypeDetailsQuery,
  type MetadataItemFragment,
} from "@dashboard/graphql";
import { mapMetadataItemToInput } from "@dashboard/utils/maps";
import { useEffect, useMemo, useRef } from "react";
import { useIntl } from "react-intl";

type CustomerTypeWithOptionalPrivateMetadata = CustomerTypeDetailsFragment & {
  privateMetadata?: MetadataItemFragment[] | null;
};

interface CustomerTypeMetadataDialogProps {
  open: boolean;
  onClose: () => void;
  customerType: CustomerTypeWithOptionalPrivateMetadata | undefined | null;
  refetchCustomerType?: () => Promise<ApolloQueryResult<CustomerTypeDetailsQuery>>;
}

export const CustomerTypeMetadataDialog = ({
  onClose,
  open,
  customerType,
  refetchCustomerType,
}: CustomerTypeMetadataDialogProps) => {
  const intl = useIntl();
  const normalizedCustomerType = useMemo(
    () =>
      customerType
        ? {
            ...customerType,
            metadata: customerType.metadata ?? [],
            privateMetadata: customerType.privateMetadata ?? [],
          }
        : undefined,
    [customerType],
  );
  const { onSubmit, lastSubmittedData, submitInProgress } = useHandleMetadataSubmit({
    initialData: normalizedCustomerType,
    onClose,
    refetchDocument: CustomerTypeDetailsDocument,
    refetch: refetchCustomerType,
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
    graphqlData: normalizedCustomerType,
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

    if (!normalizedCustomerType || wasOpenRef.current) {
      return;
    }

    reset({
      metadata: normalizedCustomerType.metadata.map(mapMetadataItemToInput),
      privateMetadata: normalizedCustomerType.privateMetadata.map(mapMetadataItemToInput),
    });
    wasOpenRef.current = true;
  }, [open, normalizedCustomerType, reset]);

  return (
    <MetadataDialog
      open={open}
      onClose={onClose}
      onSave={async () => {
        await onSubmit(getFormData());
      }}
      title={intl.formatMessage({
        defaultMessage: "Customer Type Metadata",
        description: "customer type metadata dialog header",
        id: "lGDCNw",
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
