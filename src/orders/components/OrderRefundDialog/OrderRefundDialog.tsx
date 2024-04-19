import { DashboardModal } from "@dashboard/components/Modal";
import { RadioTiles } from "@dashboard/components/RadioTiles/RadioTiles";
import { buttonMessages } from "@dashboard/intl";
import { Box, Button, Text } from "@saleor/macaw-ui-next";
import React from "react";
import { useIntl } from "react-intl";

import { orderRefundDialogMesages } from "./messages";

interface OrderRefundDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

type RefundType = "standard" | "misc";

export const OrderRefundDialog = ({ open, onClose, onConfirm }: OrderRefundDialogProps) => {
  const [selected, setSelected] = React.useState<RefundType>("standard");
  const intl = useIntl();
  const handleClose = () => {
    setSelected("standard");
    onClose();
  };

  return (
    <DashboardModal open={open} onChange={handleClose}>
      <DashboardModal.Content __width="400px">
        <DashboardModal.Title>
          {intl.formatMessage(orderRefundDialogMesages.title)}
        </DashboardModal.Title>
        <Text>{intl.formatMessage(orderRefundDialogMesages.subtitle)}</Text>
        <RadioTiles asChild value={selected} onValueChange={val => setSelected(val as RefundType)}>
          <Box
            as="fieldset"
            borderWidth={0}
            margin={0}
            padding={0}
            gap={4}
            display="flex"
            flexDirection="column"
          >
            <RadioTiles.RadioTile
              value={"standard"}
              checked={selected === "standard"}
              title={intl.formatMessage(orderRefundDialogMesages.standardRefundTitle)}
              description={intl.formatMessage(orderRefundDialogMesages.standardRefundSubtitle)}
            />
            <RadioTiles.RadioTile
              value={"misc"}
              checked={selected === "misc"}
              title={intl.formatMessage(orderRefundDialogMesages.miscRefundTitle)}
              description={intl.formatMessage(orderRefundDialogMesages.miscRefundSubtitle)}
            />
          </Box>
        </RadioTiles>
        <DashboardModal.Actions>
          <Button onClick={onClose} variant="secondary">
            <Text fontWeight="medium">{intl.formatMessage(buttonMessages.cancel)}</Text>
          </Button>
          <Button onClick={onConfirm}>
            <Text fontWeight="medium" color="buttonDefaultPrimary">
              {intl.formatMessage(buttonMessages.confirm)}
            </Text>
          </Button>
        </DashboardModal.Actions>
      </DashboardModal.Content>
    </DashboardModal>
  );
};
