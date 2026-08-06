import { MetadataDialog } from "@dashboard/components/MetadataDialog/MetadataDialog";
import { useHandleMetadataSubmit } from "@dashboard/components/MetadataDialog/useHandleMetadataSubmit";
import { useMetadataForm } from "@dashboard/components/MetadataDialog/useMetadataForm";
import { mapFieldArrayToMetadataInput } from "@dashboard/components/MetadataDialog/validation";
import { VoucherDetailsDocument, type VoucherDetailsQuery } from "@dashboard/graphql";
import { useEffect } from "react";
import { useIntl } from "react-intl";

type VoucherMetadataDialogData = NonNullable<VoucherDetailsQuery["voucher"]>;

interface VoucherMetadataDialogProps {
  open: boolean;
  onClose: () => void;
  voucher: VoucherMetadataDialogData | undefined | null;
}

export const VoucherMetadataDialog = ({ onClose, open, voucher }: VoucherMetadataDialogProps) => {
  const intl = useIntl();
  const normalizedVoucher = voucher
    ? { ...voucher, privateMetadata: voucher.privateMetadata ?? [] }
    : undefined;
  const { onSubmit, lastSubmittedData, submitInProgress } = useHandleMetadataSubmit({
    initialData: normalizedVoucher,
    onClose,
    refetchDocument: VoucherDetailsDocument,
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
    graphqlData: normalizedVoucher,
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
        defaultMessage: "Voucher Metadata",
        description: "voucher metadata dialog header",
        id: "Csi0Bk",
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
