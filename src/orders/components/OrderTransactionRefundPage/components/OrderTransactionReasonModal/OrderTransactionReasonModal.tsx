import { DashboardModal } from "@dashboard/components/Modal";
import { buttonMessages } from "@dashboard/intl";
import { Button, Text, Textarea } from "@saleor/macaw-ui-next";
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
      <DashboardModal.Content data-test-id="refund-reason-dialog" __minWidth="300px">
        <DashboardModal.Title display="flex" justifyContent="space-between" alignItems="center">
          <FormattedMessage
            {...(reason ? refundTableMessages.editReason : refundTableMessages.addReason)}
          />
          <DashboardModal.Close onClose={onClose} />
        </DashboardModal.Title>
        <Text color="default2">
          <FormattedMessage {...refundTableMessages.lineReasonDescription} />
        </Text>

        <Textarea
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
            data-test-id="edit-reason-button"
          >
            <FormattedMessage {...buttonMessages.confirm} />
          </Button>
        </DashboardModal.Actions>
      </DashboardModal.Content>
    </DashboardModal>
  );
};
