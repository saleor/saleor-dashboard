import { DashboardModal } from "@dashboard/components/Modal";
import { buttonMessages } from "@dashboard/intl";
import { type DialogProps } from "@dashboard/types";
import { Button, Text } from "@saleor/macaw-ui-next";
import { FormattedMessage } from "react-intl";

import { orderCannotCancelOrderDialogMessages as messages } from "./messages";

export const OrderCannotCancelOrderDialog = ({ open, onClose }: DialogProps) => {
  return (
    <DashboardModal onChange={onClose} open={open}>
      <DashboardModal.Content size="xs">
        <DashboardModal.Header data-test-id="dialog-title">
          <FormattedMessage {...messages.title} />
        </DashboardModal.Header>

        <DashboardModal.Body>
          <DashboardModal.Inset>
            <Text>
              <FormattedMessage {...messages.description} />
            </Text>
          </DashboardModal.Inset>
        </DashboardModal.Body>

        <DashboardModal.Actions>
          <Button variant="secondary" onClick={onClose} data-test-id="confirm">
            <FormattedMessage {...buttonMessages.ok} />
          </Button>
        </DashboardModal.Actions>
      </DashboardModal.Content>
    </DashboardModal>
  );
};

OrderCannotCancelOrderDialog.displayName = "OrderCannotCancelOrderDialog";
