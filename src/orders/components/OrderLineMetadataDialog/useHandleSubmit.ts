import { useApolloClient } from "@apollo/client";
import {
  OrderLinesMetadataDocument,
  useUpdateMetadataMutation,
  useUpdatePrivateMetadataMutation,
} from "@dashboard/graphql";
import { useNotifier } from "@dashboard/hooks/useNotifier/useNotifier";
import createMetadataUpdateHandler from "@dashboard/utils/handlers/metadataUpdateHandler";
import { useState } from "react";
import { useIntl } from "react-intl";

import {
  type OrderLineAndVariantMetadataFormData,
  type OrderLineMetadataDialogData,
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

  /** Saves the order line's metadata, sending only what differs from `baseline`, what the form was loaded with. */
  const onSubmit = async (
    data: OrderLineAndVariantMetadataFormData,
    baseline: OrderLineAndVariantMetadataFormData | undefined,
  ): Promise<void> => {
    // Without loaded metadata there is nothing to compare against and nothing gets sent,
    // so don't report a save that didn't happen.
    if (!initialData || !baseline) {
      return;
    }

    setSubmitInProgress(true);

    try {
      const saveOrderLine = createMetadataUpdateHandler(
        { id: initialData.id, ...baseline.orderLine },
        // Placeholder to keep backward compatibility - we now use react-hook-form for form state management
        async (): Promise<never[]> => [],
        variables => updateMetadata({ variables }),
        variables => updatePrivateMetadata({ variables }),
      );
      // The variant's metadata is shown read-only, so this sends nothing unless it was edited.
      const saveVariant = initialData.variant
        ? createMetadataUpdateHandler(
            { id: initialData.variant.id, ...baseline.variant },
            async (): Promise<never[]> => [],
            variables => updateMetadata({ variables }),
            variables => updatePrivateMetadata({ variables }),
          )
        : async (): Promise<never[]> => [];

      const errors = [
        ...(await saveOrderLine(data.orderLine)),
        ...(await saveVariant(data.variant)),
      ];

      if (errors.length > 0) {
        return;
      }

      // The save itself succeeded, so a failed reload doesn't undo it.
      try {
        await client.refetchQueries({ include: [OrderLinesMetadataDocument] });
      } catch {
        // Nothing to undo.
      }

      notify({
        status: "success",
        text: intl.formatMessage({
          id: "gelco+",
          defaultMessage: "Metadata updated",
        }),
      });
      onClose();
    } finally {
      setSubmitInProgress(false);
    }
  };

  return {
    onSubmit,
    submitInProgress: submitInProgress,
  };
};
