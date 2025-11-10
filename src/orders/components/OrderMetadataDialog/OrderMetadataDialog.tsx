import { ButtonWithLoader } from "@dashboard/components/ButtonWithLoader/ButtonWithLoader";
import { MetadataFormData } from "@dashboard/components/Metadata";
import { MetadataCard } from "@dashboard/components/Metadata/MetadataCard";
import { MetadataLoadingCard } from "@dashboard/components/Metadata/MetadataLoadingCard";
import { DashboardModal } from "@dashboard/components/Modal";
import { OrderDetailsWithMetadataQuery } from "@dashboard/graphql";
import { buttonMessages } from "@dashboard/intl";
import { mapMetadataItemToInput } from "@dashboard/utils/maps";
import { Box, Button } from "@saleor/macaw-ui-next";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { FormattedMessage } from "react-intl";

import { useHandleOrderMetadataSubmit } from "./useHandleSubmit";
import { useOrderMetadataFormControls } from "./useOrderMetadataFormControls";
import { mapFieldArrayToMetadataInput } from "./utils";

export type OrderMetadataDialogData = NonNullable<OrderDetailsWithMetadataQuery["order"]>;

export interface OrderMetadataFormData extends MetadataFormData {}

interface OrderMetadataDialogProps {
  open: boolean;
  onClose: () => void;
  orderId: string;
  data: OrderMetadataDialogData | undefined;
  loading: boolean;
}

export const OrderMetadataDialog = ({
  onClose,
  open,
  orderId: _orderId,
  data,
  loading,
}: OrderMetadataDialogProps) => {
  const { onSubmit, lastSubmittedData, submitInProgress } = useHandleOrderMetadataSubmit({
    initialData: data,
    onClose,
  });

  const formMethods = useForm<OrderMetadataFormData>({
    // Display last submitted data while re-fetching to avoid flicker on UI
    values: submitInProgress
      ? lastSubmittedData
      : {
          // Removes __typename from metadata item object
          metadata: (data?.metadata ?? []).map(mapMetadataItemToInput),
          privateMetadata: (data?.privateMetadata ?? [])?.map(mapMetadataItemToInput),
        },
  });

  const { handleSubmit, control, getValues, formState, trigger, reset } = formMethods;

  const {
    metadataFields,
    privateMetadataFields,
    handleMetadataChange,
    handlePrivateMetadataChange,
    metadataErrors,
    privateMetadataErrors,
  } = useOrderMetadataFormControls({ control, trigger, getValues, formState });

  useEffect(() => {
    if (!open) {
      reset();
    }
  }, [open, reset]);

  return (
    <DashboardModal open={open} onChange={onClose}>
      <DashboardModal.Content size="md" overflowY="hidden">
        <DashboardModal.Title>
          <FormattedMessage
            defaultMessage="Order metadata"
            description="dialog title, editing order metadata"
            id="zsCVOL"
          />
        </DashboardModal.Title>

        {/* This is scroll container so that Save and title are always visible */}
        <Box
          style={{
            // Max height calculated so that there's no scroll on modal itself
            maxHeight: "calc(-320px + 100vh)",
            // Remove right margin (DashboardModal.Content has 6 units padding)
            // It has to be removed to avoid spacing out horizontal scroll in weird way
            marginRight: "calc(var(--mu-spacing-6) * -1)",
          }}
          // Re-add back removed padding via negative marginRight
          paddingRight={6}
          overflowY="auto"
        >
          <Box as="form" onSubmit={handleSubmit(onSubmit)}>
            {loading && !data ? (
              <Box display="grid" gap={2}>
                <MetadataLoadingCard />
                <MetadataLoadingCard isPrivate />
              </Box>
            ) : (
              <Box display="grid" gap={2}>
                <MetadataCard
                  data={mapFieldArrayToMetadataInput(metadataFields)}
                  isPrivate={false}
                  disabled={loading || submitInProgress}
                  onChange={handleMetadataChange}
                  error={metadataErrors.length ? metadataErrors.join(", ") : undefined}
                />

                <MetadataCard
                  data={mapFieldArrayToMetadataInput(privateMetadataFields)}
                  isPrivate={true}
                  disabled={loading || submitInProgress}
                  onChange={handlePrivateMetadataChange}
                  error={
                    privateMetadataErrors.length ? privateMetadataErrors.join(", ") : undefined
                  }
                />
              </Box>
            )}
          </Box>
        </Box>

        <DashboardModal.Actions
          paddingTop={4}
          paddingX={6}
          bottom={6}
          width="100%"
          backgroundColor="default1"
        >
          <ButtonWithLoader
            transitionState={submitInProgress ? "loading" : "default"}
            data-test-id="save"
            variant="primary"
            disabled={submitInProgress || !formState.isDirty}
            type="submit"
            onClick={handleSubmit(onSubmit)}
          >
            <FormattedMessage {...buttonMessages.save} />
          </ButtonWithLoader>
          <Button data-test-id="back" variant="secondary" onClick={onClose}>
            <FormattedMessage {...buttonMessages.close} />
          </Button>
        </DashboardModal.Actions>
      </DashboardModal.Content>
    </DashboardModal>
  );
};
