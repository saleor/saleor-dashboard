import { type ApolloQueryResult } from "@apollo/client";
import { MetadataDialog } from "@dashboard/components/MetadataDialog/MetadataDialog";
import { useHandleMetadataSubmit } from "@dashboard/components/MetadataDialog/useHandleMetadataSubmit";
import { useMetadataForm } from "@dashboard/components/MetadataDialog/useMetadataForm";
import { mapFieldArrayToMetadataInput } from "@dashboard/components/MetadataDialog/validation";
import {
  PageTypeDetailsDocument,
  type PageTypeDetailsFragment,
  type PageTypeDetailsQuery,
} from "@dashboard/graphql";
import { mapMetadataItemToInput } from "@dashboard/utils/maps";
import { useEffect, useMemo, useRef } from "react";
import { useIntl } from "react-intl";

interface PageTypeMetadataDialogProps {
  open: boolean;
  onClose: () => void;
  pageType: PageTypeDetailsFragment | undefined | null;
  refetchPageType?: () => Promise<ApolloQueryResult<PageTypeDetailsQuery>>;
}

export const PageTypeMetadataDialog = ({
  onClose,
  open,
  pageType,
  refetchPageType,
}: PageTypeMetadataDialogProps) => {
  const intl = useIntl();
  const normalizedPageType = useMemo(
    () =>
      pageType
        ? {
            ...pageType,
            metadata: pageType.metadata ?? [],
            privateMetadata: pageType.privateMetadata ?? [],
          }
        : undefined,
    [pageType],
  );
  const { onSubmit, lastSubmittedData, submitInProgress } = useHandleMetadataSubmit({
    initialData: normalizedPageType,
    onClose,
    refetchDocument: PageTypeDetailsDocument,
    refetch: refetchPageType,
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
    graphqlData: normalizedPageType,
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

    if (!normalizedPageType || wasOpenRef.current) {
      return;
    }

    reset({
      metadata: normalizedPageType.metadata.map(mapMetadataItemToInput),
      privateMetadata: normalizedPageType.privateMetadata.map(mapMetadataItemToInput),
    });
    wasOpenRef.current = true;
  }, [open, normalizedPageType, reset]);

  return (
    <MetadataDialog
      open={open}
      onClose={onClose}
      onSave={async () => {
        await onSubmit(getFormData());
      }}
      title={intl.formatMessage({
        defaultMessage: "Model Type Metadata",
        description: "model type metadata dialog header",
        id: "IMXS9Z",
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
