import { useApolloClient } from "@apollo/client";
import {
  OrderLinesMetadataDocument,
  useUpdateMetadataMutation,
  useUpdatePrivateMetadataMutation,
} from "@dashboard/graphql";
import useNotifier from "@dashboard/hooks/useNotifier";
import { commonMessages } from "@dashboard/intl";
import createMetadataUpdateHandler from "@dashboard/utils/handlers/metadataUpdateHandler";
import { useMemo, useRef, useState } from "react";
import { useIntl } from "react-intl";

import {
  OrderLineAndVariantMetadataFormData,
  OrderLineMetadataDialogData,
} from "./OrderLineMetadataDialog";

export const useHandleOrderLineMetadataSubmit = ({
  initialData,
  onClose,
}: {
  initialData: OrderLineMetadataDialogData | undefined;
  onClose: () => void;
}) => {
  const notify = useNotifier();
  const intl = useIntl();

  const client = useApolloClient();

  const [updateMetadata] = useUpdateMetadataMutation();
  const [updatePrivateMetadata] = useUpdatePrivateMetadataMutation();

  const [submitInProgress, setSubmitInProgress] = useState(false);
  const submittedData = useRef<OrderLineAndVariantMetadataFormData>();

  const orderLineSubmitHandler = useMemo(() => {
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

  const variantSubmitHandler = useMemo(() => {
    // Fallback handler: If there is no variant data to submit,
    // return a promise resolving to an empty error array.
    // This is appropriate because no submission occurs, so no errors are possible.
    if (!initialData?.variant) {
      return () => Promise.resolve([]);
    }

    // Ensure privateMetadata is always present for the handler
    const variantWithMetadata = {
      ...initialData.variant,
      privateMetadata: initialData.variant.privateMetadata ?? [],
    };

    return createMetadataUpdateHandler(
      variantWithMetadata,
      () => Promise.resolve([]),
      variables => updateMetadata({ variables }),
      variables => updatePrivateMetadata({ variables }),
    );
  }, [initialData?.variant, updateMetadata, updatePrivateMetadata]);

  const onSubmit = async (data: OrderLineAndVariantMetadataFormData) => {
    setSubmitInProgress(true);
    submittedData.current = data;

    // Submit both order line and variant metadata
    const orderLineErrors = await orderLineSubmitHandler(data.orderLine);
    const variantErrors = await variantSubmitHandler(data.variant);

    client.refetchQueries({ include: [OrderLinesMetadataDocument] });

    // Check if both submissions succeeded
    const allErrors = [...orderLineErrors, ...variantErrors];

    if (allErrors.length === 0) {
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
