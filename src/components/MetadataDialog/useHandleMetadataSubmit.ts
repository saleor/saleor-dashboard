import { type ApolloQueryResult, type DocumentNode, useApolloClient } from "@apollo/client";
import { type MetadataFormData } from "@dashboard/components/Metadata/types";
import { useUpdateMetadataMutation, useUpdatePrivateMetadataMutation } from "@dashboard/graphql";
import { useNotifier } from "@dashboard/hooks/useNotifier/useNotifier";
import createMetadataUpdateHandler from "@dashboard/utils/handlers/metadataUpdateHandler";
import { useState } from "react";
import { useIntl } from "react-intl";

export const useHandleMetadataSubmit = <T extends { id: string }>({
  initialData,
  onClose,
  refetchDocument,
  refetch,
}: {
  initialData: T | undefined;
  onClose: () => void;
  refetchDocument: DocumentNode;
  refetch?: () => Promise<ApolloQueryResult<unknown>>;
}): {
  /**
   * Saves `data`, sending only what differs from `baseline`: the metadata the form was loaded
   * with (`useMetadataForm`'s `baseline`). Entries the user didn't touch are never sent.
   */
  onSubmit: (data: MetadataFormData, baseline: MetadataFormData | undefined) => Promise<void>;
  submitInProgress: boolean;
} => {
  const notify = useNotifier();
  const intl = useIntl();

  const client = useApolloClient();

  const [updateMetadata, { loading: metadataLoading }] = useUpdateMetadataMutation();
  const [updatePrivateMetadata, { loading: privateMetadataLoading }] =
    useUpdatePrivateMetadataMutation();
  // Covers the whole save, including the reload after it, so nothing can be typed in a dialog
  // that is about to close.
  const [saving, setSaving] = useState(false);

  const submitInProgress = saving || metadataLoading || privateMetadataLoading;

  const onSubmit = async (
    data: MetadataFormData,
    baseline: MetadataFormData | undefined,
  ): Promise<void> => {
    // Without loaded metadata there is nothing to compare against and nothing gets sent,
    // so don't report a save that didn't happen.
    if (!initialData || !baseline) {
      return;
    }

    setSaving(true);

    try {
      const saveChanges = createMetadataUpdateHandler(
        { id: initialData.id, ...baseline },
        // Placeholder to keep backward compatibility - we now use react-hook-form for form state management
        async (): Promise<never[]> => [],
        variables => updateMetadata({ variables }),
        variables => updatePrivateMetadata({ variables }),
      );
      const errors = await saveChanges(data);

      if (errors.length > 0) {
        return;
      }

      // The metadata is saved at this point; reload it so the page shows the saved values. If
      // the reload fails, the save still stands, so confirm it anyway.
      try {
        if (refetch) {
          await refetch();
        } else {
          await client.refetchQueries({ include: [refetchDocument] });
        }
      } catch {
        // Nothing to undo: the save itself succeeded.
      }

      notify({
        status: "success",
        text: intl.formatMessage({ id: "gelco+", defaultMessage: "Metadata updated" }),
      });
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return {
    onSubmit,
    submitInProgress,
  };
};
