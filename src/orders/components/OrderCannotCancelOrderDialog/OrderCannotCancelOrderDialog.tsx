import { DashboardModal } from "@dashboard/components/Modal";
import { buttonMessages } from "@dashboard/intl";
import { DialogProps } from "@dashboard/types";
import { Button, Text } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage } from "react-intl";

const OrderCannotCancelOrderDialog: React.FC<DialogProps> = ({ open, onClose }) => {
  return (
    <DashboardModal onChange={onClose} open={open}>
      <DashboardModal.Content size="md">
        <DashboardModal.Title>
          <FormattedMessage
            id="NhQboB"
            defaultMessage="Saleor couldn’t cancel order"
            description="dialog header"
          />
        </DashboardModal.Title>

        <Text>
          <FormattedMessage
            id="b+jcaN"
            defaultMessage="There are still fulfillments created for this order. Cancel the fulfillments first before you cancel the order."
          />
        </Text>

        <DashboardModal.Actions>
          <Button variant="error" onClick={onClose}>
            <FormattedMessage {...buttonMessages.ok} />
          </Button>
        </DashboardModal.Actions>
      </DashboardModal.Content>
    </DashboardModal>
  );
};

OrderCannotCancelOrderDialog.displayName = "OrderCannotCancelOrderDialog";
export default OrderCannotCancelOrderDialog;
