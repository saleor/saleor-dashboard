import { type ApolloQueryResult, type DocumentNode, useApolloClient } from "@apollo/client";
import { type MetadataFormData } from "@dashboard/components/Metadata";
import { useUpdateMetadataMutation, useUpdatePrivateMetadataMutation } from "@dashboard/graphql";
import { useNotifier } from "@dashboard/hooks/useNotifier";
import createMetadataUpdateHandler from "@dashboard/utils/handlers/metadataUpdateHandler";
import { mapMetadataItemToInput } from "@dashboard/utils/maps";
import { useMemo, useRef } from "react";
import { useIntl } from "react-intl";

export const useHandleMetadataSubmit = <
  T extends { id: string; metadata: any; privateMetadata: any },
>({
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

  const normalizedInitialData = useMemo(() => {
    if (!initialData) {
      return undefined;
    }

    return {
      ...initialData,
      metadata: (initialData.metadata ?? []).map(mapMetadataItemToInput),
      privateMetadata: (initialData.privateMetadata ?? []).map(mapMetadataItemToInput),
    };
  }, [initialData]);

  const fulfillmentSubmitHandler = useMemo(() => {
    if (!normalizedInitialData) {
      return (): Promise<any[]> => Promise.resolve([]);
    }

    return createMetadataUpdateHandler(
      normalizedInitialData,
      // Placeholder to keep backward compatibility - we now use react-hook-form for form state management
      (): Promise<any[]> => Promise.resolve([]),
      variables => updateMetadata({ variables }),
      variables => updatePrivateMetadata({ variables }),
    );
  }, [normalizedInitialData, updateMetadata, updatePrivateMetadata]);

  const onSubmit = async (data: MetadataFormData): Promise<void> => {
    submittedData.current = data;

    const errors = await fulfillmentSubmitHandler(data);

    if (errors.length > 0) {
      return;
    }

    if (refetch) {
      await refetch();
    } else {
      const result = client.refetchQueries({ include: [refetchDocument] });

      await Promise.all(
        result.queries.map(query =>
          query.refetch({
            fetchPolicy: "network-only",
          }),
        ),
      );
    }

    notify({
      status: "success",
      text: intl.formatMessage({ id: "gelco+", defaultMessage: "Metadata updated" }),
    });
    onClose();
  };

  return {
    onSubmit,
    lastSubmittedData: submittedData.current,
    submitInProgress: submitInProgress,
  };
};
