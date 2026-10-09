import BackButton from "@dashboard/components/BackButton";
import {
  ConfirmButton,
  type ConfirmButtonTransitionState,
} from "@dashboard/components/ConfirmButton/ConfirmButton";
import { DashboardModal } from "@dashboard/components/Modal";
import { buttonMessages } from "@dashboard/intl";
import { messages } from "@dashboard/warehouses/messages";
import { Text } from "@saleor/macaw-ui-next";
import { type ReactNode } from "react";
import { FormattedMessage } from "react-intl";

interface WarehouseDeleteDialogProps {
  confirmButtonState: ConfirmButtonTransitionState;
  open: boolean;
  onConfirm: () => void;
  onClose: () => void;
  name: string;
  /** Null when the count is still loading or could not be loaded. */
  stockCount?: number | null;
  /** Null when channel membership is still loading or could not be loaded. */
  channelCount?: number | null;
}

export const WarehouseDeleteDialog = ({
  name,
  confirmButtonState,
  onClose,
  onConfirm,
  open,
  stockCount = null,
  channelCount = null,
}: WarehouseDeleteDialogProps): ReactNode => {
  const isSubmitting = confirmButtonState === "loading";

  const handleClose = (): void => {
    if (isSubmitting) {
      return;
    }

    onClose();
  };

  return (
    <DashboardModal onChange={handleClose} open={open}>
      <DashboardModal.Content size="xs">
        <DashboardModal.Header
          subtitle={
            <FormattedMessage
              id="DTL7sE"
              defaultMessage="Are you sure you want to delete {warehouseName}?"
              description="dialog content"
              values={{
                warehouseName: <strong>{name}</strong>,
              }}
            />
          }
        >
          <FormattedMessage
            id="ny4zrH"
            defaultMessage="Delete Warehouse"
            description="dialog title"
          />
        </DashboardModal.Header>
        <DashboardModal.Body>
          <Text size={3} color="default2" data-test-id="warehouse-delete-impact">
            {stockCount === null ? (
              <FormattedMessage {...messages.deleteImpactStockUnknown} />
            ) : stockCount === 0 ? (
              <FormattedMessage {...messages.deleteImpactNoStock} />
            ) : stockCount === 1 ? (
              <FormattedMessage {...messages.deleteImpactStockOne} />
            ) : (
              <FormattedMessage {...messages.deleteImpactStock} values={{ count: stockCount }} />
            )}{" "}
            {channelCount === null ? (
              <FormattedMessage {...messages.deleteImpactChannelsUnknown} />
            ) : channelCount === 0 ? (
              <FormattedMessage {...messages.deleteImpactNoChannels} />
            ) : channelCount === 1 ? (
              <FormattedMessage {...messages.deleteImpactChannelOne} />
            ) : (
              <FormattedMessage
                {...messages.deleteImpactChannels}
                values={{ count: channelCount }}
              />
            )}
          </Text>
        </DashboardModal.Body>
        <DashboardModal.Actions>
          <BackButton disabled={isSubmitting} onClick={handleClose} />
          <ConfirmButton
            data-test-id="submit"
            disabled={isSubmitting}
            onClick={onConfirm}
            transitionState={confirmButtonState}
            variant="error"
          >
            <FormattedMessage {...buttonMessages.delete} />
          </ConfirmButton>
        </DashboardModal.Actions>
      </DashboardModal.Content>
    </DashboardModal>
  );
};

WarehouseDeleteDialog.displayName = "WarehouseDeleteDialog";
