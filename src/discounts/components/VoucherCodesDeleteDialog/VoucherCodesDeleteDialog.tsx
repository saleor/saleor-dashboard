import { DashboardCard } from "@dashboard/components/Card";
import { buttonMessages } from "@dashboard/intl";
import { Box, Button, Modal, Text } from "@saleor/macaw-ui/next";
import React from "react";
import { useIntl } from "react-intl";

interface VoucherCodesDeleteDialogProps {
  open: boolean;
  onClose: () => void;
  onDelete: () => void;
}

export const VoucherCodesDeleteDialog = ({
  open,
  onClose,
  onDelete,
}: VoucherCodesDeleteDialogProps) => {
  const intl = useIntl();

  return (
    <Modal open={open} onChange={onClose}>
      <Modal.Content>
        <Box
          backgroundColor="surfaceNeutralPlain"
          boxShadow="modal"
          __left="50%"
          __top="50%"
          position="fixed"
          __maxWidth="400px"
          __transform="translate(-50%, -50%)"
        >
          <DashboardCard>
            <DashboardCard.Title>Delete voucher code</DashboardCard.Title>
            <DashboardCard.Content>
              <Text as="p" marginBottom={6}>
                Are you sure you want to delete this voucher code?
              </Text>
              <Box
                display="flex"
                justifyContent="flex-end"
                gap={3}
                paddingBottom={6}
              >
                <Button onClick={onClose} variant="secondary">
                  {intl.formatMessage(buttonMessages.cancel)}
                </Button>
                <Button onClick={onDelete}>
                  {intl.formatMessage(buttonMessages.delete)}
                </Button>
              </Box>
            </DashboardCard.Content>
          </DashboardCard>
        </Box>
      </Modal.Content>
    </Modal>
  );
};
