import { DashboardModal } from "@dashboard/components/Modal";
import { buttonMessages } from "@dashboard/intl";
import { Button, Textarea } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage } from "react-intl";

import { refundTableMessages } from "../OrderTransactionRefundTable/messages";

interface OrderTransactionReasonModalProps {
  open: boolean;
  reason: string | null;
  onClose: () => void;
  onConfirm: (reason: string) => void;
}

export const OrderTransactionReasonModal = ({
  open,
  reason,
  onClose,
  onConfirm,
}: OrderTransactionReasonModalProps) => {
  const [tempReason, setTempReason] = React.useState<string>(reason ?? "");

  React.useEffect(() => {
    setTempReason(reason ?? "");
  }, [reason]);

  return (
    <DashboardModal open={open} onChange={onClose}>
      <DashboardModal.Content data-test-id="refund-reason-dialog" size="xs">
        <DashboardModal.Header>
          <FormattedMessage
            {...(reason ? refundTableMessages.editReason : refundTableMessages.addReason)}
          />
        </DashboardModal.Header>

        <Textarea
          data-test-id="line-refund-reason-input"
          rows={5}
          value={tempReason}
          onChange={event => setTempReason(event.target.value)}
        />

        <DashboardModal.Actions>
          <Button onClick={onClose} variant="secondary" data-test-id="cancel-delete-rule-button">
            <FormattedMessage {...buttonMessages.cancel} />
          </Button>
          <Button
            onClick={() => {
              onConfirm(tempReason);
              onClose();
            }}
            data-test-id="confirm-button"
          >
            <FormattedMessage {...buttonMessages.confirm} />
          </Button>
        </DashboardModal.Actions>
      </DashboardModal.Content>
    </DashboardModal>
  );
};
