import { type ApolloQueryResult, type DocumentNode, useApolloClient } from "@apollo/client";
import { type MetadataFormData } from "@dashboard/components/Metadata/types";
import { useUpdateMetadataMutation, useUpdatePrivateMetadataMutation } from "@dashboard/graphql";
import { useNotifier } from "@dashboard/hooks/useNotifier/useNotifier";
import createMetadataUpdateHandler from "@dashboard/utils/handlers/metadataUpdateHandler";
import { useEffect, useRef, useState } from "react";
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
  // Covers both requests of a save, so the dialog can't be edited or closed in between.
  const [saving, setSaving] = useState(false);
  // A save can finish after its dialog unmounted (closed, or the user navigated away); its
  // onClose would then close whatever dialog is open by then.
  const mounted = useRef(true);

  useEffect(function trackMounted() {
    mounted.current = true;

    return () => {
      mounted.current = false;
    };
  }, []);

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

      // The metadata is saved, and the mutation results already updated the cache. Reload it
      // in the background so the page also picks up anything else that changed; the dialog
      // doesn't wait, so a slow reload can't hold it open, and a failed one doesn't undo the save.
      const reload = refetch ? refetch() : client.refetchQueries({ include: [refetchDocument] });

      Promise.resolve(reload).catch(() => undefined);

      notify({
        status: "success",
        text: intl.formatMessage({ id: "gelco+", defaultMessage: "Metadata updated" }),
      });

      if (mounted.current) {
        onClose();
      }
    } finally {
      if (mounted.current) {
        setSaving(false);
      }
    }
  };

  return {
    onSubmit,
    submitInProgress,
  };
};
