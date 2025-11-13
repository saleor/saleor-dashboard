import { ButtonWithLoader } from "@dashboard/components/ButtonWithLoader/ButtonWithLoader";
import { MetadataFormData } from "@dashboard/components/Metadata";
import { MetadataCard } from "@dashboard/components/Metadata/MetadataCard";
import { DashboardModal } from "@dashboard/components/Modal";
import { OrderDetailsQuery } from "@dashboard/graphql";
import { buttonMessages, commonMessages } from "@dashboard/intl";
import { mapMetadataItemToInput } from "@dashboard/utils/maps";
import { Box, Button, Text } from "@saleor/macaw-ui-next";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { FormattedMessage, useIntl } from "react-intl";

import { useHandleOrderMetadataSubmit } from "./useHandleSubmit";
import { useOrderMetadataFormControls } from "./useOrderMetadataFormControls";
import { mapFieldArrayToMetadataInput } from "./utils";

export type OrderMetadataDialogData = NonNullable<OrderDetailsQuery["order"]>;

interface OrderMetadataDialogProps {
  open: boolean;
  onClose: () => void;
  order: OrderMetadataDialogData | undefined;
}

export const OrderMetadataDialog = ({ onClose, open, order }: OrderMetadataDialogProps) => {
  const intl = useIntl();
  const { onSubmit, lastSubmittedData, submitInProgress } = useHandleOrderMetadataSubmit({
    initialData: order,
    onClose,
  });

  const formMethods = useForm<MetadataFormData>({
    // Display last submitted data while re-fetching to avoid flicker on UI
    values: submitInProgress
      ? lastSubmittedData
      : {
          // Removes __typename from metadata item object
          metadata: (order?.metadata ?? []).map(mapMetadataItemToInput),
          privateMetadata: (order?.privateMetadata ?? [])?.map(mapMetadataItemToInput),
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
        <DashboardModal.Header>{intl.formatMessage(commonMessages.metadata)}</DashboardModal.Header>

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
            <Box display="flex" flexDirection="column" gap={2}>
              <Box display="flex" flexDirection="column" marginLeft={6} marginBottom={2}>
                <Text>
                  <FormattedMessage
                    defaultMessage="Metadata associated with this order"
                    description="dialog, editing order metadata"
                    id="lF7y0e"
                  />
                </Text>
              </Box>

              <MetadataCard
                data={mapFieldArrayToMetadataInput(metadataFields)}
                isPrivate={false}
                disabled={submitInProgress}
                onChange={handleMetadataChange}
                error={metadataErrors.length ? metadataErrors.join(", ") : undefined}
              />

              <MetadataCard
                data={mapFieldArrayToMetadataInput(privateMetadataFields)}
                isPrivate={true}
                disabled={submitInProgress}
                onChange={handlePrivateMetadataChange}
                error={privateMetadataErrors.length ? privateMetadataErrors.join(", ") : undefined}
              />
            </Box>
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
