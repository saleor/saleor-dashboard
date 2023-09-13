import { DashboardCard } from "@dashboard/components/Card";
import useForm from "@dashboard/hooks/useForm";
import { buttonMessages } from "@dashboard/intl";
import { Box, Button, Input, Modal } from "@saleor/macaw-ui/next";
import React from "react";
import { useIntl } from "react-intl";

interface VoucherCodesGenerateDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
}

export const VoucherCodesGenerateDialog = ({
  open,
  onClose,
  onSubmit,
}: VoucherCodesGenerateDialogProps) => {
  const intl = useIntl();
  const { change, submit, data, reset } = useForm(
    {
      quantity: "",
      prefix: "",
    },
    onSubmit,
  );

  return (
    <Modal
      open={open}
      onChange={() => {
        onClose();
        reset();
      }}
    >
      <Modal.Content>
        <Box
          backgroundColor="surfaceNeutralPlain"
          boxShadow="modal"
          __left="50%"
          __top="50%"
          position="fixed"
          __transform="translate(-50%, -50%)"
        >
          <DashboardCard>
            <DashboardCard.Title>Generate voucher codes</DashboardCard.Title>
            <DashboardCard.Content>
              <Box display="grid" gap={3} marginBottom={6} __width={390}>
                <Input
                  name="quantity"
                  label="Code quantity"
                  value={data.quantity}
                  onChange={change}
                />
                <Input
                  name="prefix"
                  label="Code Prefix (Optional)"
                  value={data.prefix}
                  onChange={change}
                />
              </Box>
              <Box
                display="flex"
                justifyContent="flex-end"
                gap={3}
                paddingBottom={6}
              >
                <Button onClick={onClose} variant="secondary">
                  {intl.formatMessage(buttonMessages.back)}
                </Button>
                <Button onClick={submit}>
                  {intl.formatMessage(buttonMessages.confirm)}
                </Button>
              </Box>
            </DashboardCard.Content>
          </DashboardCard>
        </Box>
      </Modal.Content>
    </Modal>
  );
};
