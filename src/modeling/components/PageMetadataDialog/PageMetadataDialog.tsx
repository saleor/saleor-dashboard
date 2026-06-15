import { type ApolloQueryResult } from "@apollo/client";
import { MetadataDialog } from "@dashboard/components/MetadataDialog/MetadataDialog";
import { useHandleMetadataSubmit } from "@dashboard/components/MetadataDialog/useHandleMetadataSubmit";
import { useMetadataForm } from "@dashboard/components/MetadataDialog/useMetadataForm";
import { mapFieldArrayToMetadataInput } from "@dashboard/components/MetadataDialog/validation";
import {
  PageDetailsDocument,
  type PageDetailsFragment,
  type PageDetailsQuery,
} from "@dashboard/graphql";
import { mapMetadataItemToInput } from "@dashboard/utils/maps";
import { useEffect, useMemo, useRef } from "react";
import { useIntl } from "react-intl";

interface PageMetadataDialogProps {
  open: boolean;
  onClose: () => void;
  page: PageDetailsFragment | undefined | null;
  refetchPage?: () => Promise<ApolloQueryResult<PageDetailsQuery>>;
}

export const PageMetadataDialog = ({
  onClose,
  open,
  page,
  refetchPage,
}: PageMetadataDialogProps) => {
  const intl = useIntl();
  const normalizedPage = useMemo(
    () =>
      page
        ? {
            ...page,
            metadata: page.metadata ?? [],
            privateMetadata: page.privateMetadata ?? [],
          }
        : undefined,
    [page],
  );
  const { onSubmit, lastSubmittedData, submitInProgress } = useHandleMetadataSubmit({
    initialData: normalizedPage,
    onClose,
    refetchDocument: PageDetailsDocument,
    refetch: refetchPage,
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
    graphqlData: normalizedPage,
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

    if (!normalizedPage || wasOpenRef.current) {
      return;
    }

    reset({
      metadata: normalizedPage.metadata.map(mapMetadataItemToInput),
      privateMetadata: normalizedPage.privateMetadata.map(mapMetadataItemToInput),
    });
    wasOpenRef.current = true;
  }, [open, normalizedPage, reset]);

  return (
    <MetadataDialog
      open={open}
      onClose={onClose}
      onSave={async () => {
        await onSubmit(getFormData());
      }}
      title={intl.formatMessage({
        defaultMessage: "Model Metadata",
        description: "model metadata dialog header",
        id: "uCJ+gT",
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
