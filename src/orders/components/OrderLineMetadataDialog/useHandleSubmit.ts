import { useApolloClient } from "@apollo/client";
import {
  OrderLinesMetadataDocument,
  useUpdateMetadataMutation,
  useUpdatePrivateMetadataMutation,
} from "@dashboard/graphql";
import { useNotifier } from "@dashboard/hooks/useNotifier/useNotifier";
import createMetadataUpdateHandler from "@dashboard/utils/handlers/metadataUpdateHandler";
import { useEffect, useRef, useState } from "react";
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
  // A save can finish after the dialog unmounted; its state can't be updated then.
  const mounted = useRef(true);

  useEffect(function trackMounted() {
    mounted.current = true;

    return () => {
      mounted.current = false;
    };
  }, []);

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

    // Where the save started. Closing rewrites the address, so it's done only while the user
    // is still there.
    const startedAt = window.location.href;

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

      // Reload in the background: a slow reload can't hold the dialog open, and a failed one
      // doesn't undo the save.
      client.refetchQueries({ include: [OrderLinesMetadataDocument] }).catch(() => undefined);

      notify({
        status: "success",
        text: intl.formatMessage({
          id: "gelco+",
          defaultMessage: "Metadata updated",
        }),
      });

      // If the user went back or elsewhere meanwhile, closing would undo that, or close a dialog
      // opened since.
      if (window.location.href === startedAt) {
        onClose();
      }
    } finally {
      if (mounted.current) {
        setSubmitInProgress(false);
      }
    }
  };

  return {
    onSubmit,
    submitInProgress: submitInProgress,
  };
};
