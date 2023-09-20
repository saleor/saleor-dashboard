import {
  ConfirmButton,
  ConfirmButtonTransitionState,
} from "@dashboard/components/ConfirmButton";
import { DashboardModal } from "@dashboard/components/Modal";
import { VoucherInput } from "@dashboard/graphql";
import { buttonMessages } from "@dashboard/intl";
import { Box, Button, Input } from "@saleor/macaw-ui/next";
import React from "react";
import { useIntl } from "react-intl";

interface VoucherCodesManualDialogProps {
  open: boolean;
  confirmButtonTransitionState: ConfirmButtonTransitionState;
  onClose: () => void;
  onSubmit: (codes: VoucherInput["codes"]) => void;
}

export const VoucherCodesManualDialog = ({
  open,
  confirmButtonTransitionState,
  onClose,
  onSubmit,
}: VoucherCodesManualDialogProps) => {
  const intl = useIntl();

  const [quantity, setQuantity] = React.useState("");
  const [usage, setUsage] = React.useState("");

  const reset = () => {
    setQuantity("");
    setUsage("");
  };

  const handleModalClose = () => {
    onClose();
    reset();
  };

  const handleSubmit = () => {
    onClose();
    onSubmit([{ code: quantity, usageLimit: Number(usage) }]);
    reset();
  };

  return (
    <DashboardModal open={open} onChange={handleModalClose}>
      <DashboardModal.Content>
        <DashboardModal.Title>Enter Voucher Code</DashboardModal.Title>
        <Box display="grid" gap={3} __width={390}>
          <Input
            name="quantity"
            type="text"
            size="small"
            label="Enter Code"
            value={quantity}
            onChange={e => setQuantity(e.target.value)}
          />

          <Input
            name="usage"
            type="text"
            size="small"
            label="Enter Usage"
            value={usage}
            onChange={e => setUsage(e.target.value)}
          />
        </Box>
        <DashboardModal.Actions>
          <Button onClick={handleModalClose} variant="secondary">
            {intl.formatMessage(buttonMessages.back)}
          </Button>
          <ConfirmButton
            transitionState={confirmButtonTransitionState}
            onClick={handleSubmit}
          >
            {intl.formatMessage(buttonMessages.confirm)}
          </ConfirmButton>
        </DashboardModal.Actions>
      </DashboardModal.Content>
    </DashboardModal>
  );
};
