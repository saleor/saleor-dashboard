import { useApolloClient } from "@apollo/client";
import { MetadataFormData } from "@dashboard/components/Metadata";
import {
  OrderDetailsDocument,
  useUpdateMetadataMutation,
  useUpdatePrivateMetadataMutation,
} from "@dashboard/graphql";
import useNotifier from "@dashboard/hooks/useNotifier";
import { commonMessages } from "@dashboard/intl";
import createMetadataUpdateHandler from "@dashboard/utils/handlers/metadataUpdateHandler";
import { useMemo, useRef, useState } from "react";
import { useIntl } from "react-intl";

import { OrderMetadataDialogData } from "./OrderMetadataDialog";

export const useHandleOrderMetadataSubmit = ({
  initialData,
  onClose,
}: {
  initialData: OrderMetadataDialogData | undefined;
  onClose: () => void;
}) => {
  const notify = useNotifier();
  const intl = useIntl();

  const client = useApolloClient();

  const [updateMetadata] = useUpdateMetadataMutation();
  const [updatePrivateMetadata] = useUpdatePrivateMetadataMutation();

  const [submitInProgress, setSubmitInProgress] = useState(false);
  const submittedData = useRef<MetadataFormData>();

  const orderSubmitHandler = useMemo(() => {
    if (!initialData) {
      return () => Promise.resolve([]);
    }

    return createMetadataUpdateHandler(
      initialData,
      // Placeholder to keep backward compatibility - we now use react-hook-form for form state management
      () => Promise.resolve([]),
      variables => updateMetadata({ variables }),
      variables => updatePrivateMetadata({ variables }),
    );
  }, [initialData, updateMetadata, updatePrivateMetadata]);

  const onSubmit = async (data: MetadataFormData) => {
    setSubmitInProgress(true);
    submittedData.current = data;

    // Submit order metadata
    const orderErrors = await orderSubmitHandler(data);

    client.refetchQueries({ include: [OrderDetailsDocument] });

    // Check if submission succeeded
    if (orderErrors.length === 0) {
      notify({
        status: "success",
        text: intl.formatMessage(commonMessages.savedChanges),
      });
      onClose();
    }

    setSubmitInProgress(false);
  };

  return {
    onSubmit,
    lastSubmittedData: submittedData.current,
    submitInProgress: submitInProgress,
  };
};
