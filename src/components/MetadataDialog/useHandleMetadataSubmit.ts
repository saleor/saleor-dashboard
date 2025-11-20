import { DocumentNode, useApolloClient } from "@apollo/client";
import { MetadataFormData } from "@dashboard/components/Metadata";
import { useUpdateMetadataMutation, useUpdatePrivateMetadataMutation } from "@dashboard/graphql";
import useNotifier from "@dashboard/hooks/useNotifier";
import { commonMessages } from "@dashboard/intl";
import createMetadataUpdateHandler from "@dashboard/utils/handlers/metadataUpdateHandler";
import { useMemo, useRef } from "react";
import { useIntl } from "react-intl";

export const useHandleMetadataSubmit = <
  T extends { id: string; metadata: any; privateMetadata: any },
>({
  initialData,
  onClose,
  refetchDocument,
}: {
  initialData: T | undefined;
  onClose: () => void;
  refetchDocument: DocumentNode;
}): {
  onSubmit: (data: MetadataFormData) => Promise<void>;
  lastSubmittedData: MetadataFormData | undefined;
  submitInProgress: boolean;
} => {
  const notify = useNotifier();
  const intl = useIntl();

  const client = useApolloClient();

  const [updateMetadata, { loading: metadataLoading }] = useUpdateMetadataMutation();
  const [updatePrivateMetadata, { loading: privateMetadataLoading }] =
    useUpdatePrivateMetadataMutation();

  const submitInProgress = metadataLoading || privateMetadataLoading;
  const submittedData = useRef<MetadataFormData>();

  const fulfillmentSubmitHandler = useMemo(() => {
    if (!initialData) {
      return (): Promise<any[]> => Promise.resolve([]);
    }

    return createMetadataUpdateHandler(
      initialData,
      // Placeholder to keep backward compatibility - we now use react-hook-form for form state management
      (): Promise<any[]> => Promise.resolve([]),
      variables => updateMetadata({ variables }),
      variables => updatePrivateMetadata({ variables }),
    );
  }, [initialData, updateMetadata, updatePrivateMetadata]);

  const onSubmit = async (data: MetadataFormData): Promise<void> => {
    submittedData.current = data;

    // Submit metadata
    const errors = await fulfillmentSubmitHandler(data);

    const result = client.refetchQueries({ include: [refetchDocument] });

    await Promise.all(result.queries.map(q => q.refetch()));

    // Check if submission succeeded
    if (errors.length === 0) {
      notify({
        status: "success",
        text: intl.formatMessage(commonMessages.savedChanges),
      });
      onClose();
    }
  };

  return {
    onSubmit,
    lastSubmittedData: submittedData.current,
    submitInProgress: submitInProgress,
  };
};
