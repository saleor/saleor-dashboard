import { WeightUnitsEnum } from "@dashboard/graphql";
import { SubmitPromise } from "@dashboard/hooks/useForm";
import { Box, Button, CloseIcon, Modal, Text } from "@saleor/macaw-ui/next";
import React from "react";
import { FormattedMessage } from "react-intl";

import ShippingWeightUnitForm from "../ShippingWeightUnitForm";

interface ShippingWeightUnitDialogProps {
  open: boolean;
  onSubmit: (unit: WeightUnitsEnum) => SubmitPromise;
  onClose: () => void;
  onChange: (val: boolean) => void;
  defaultWeightUnit: WeightUnitsEnum;
  disabled: boolean;
}

export const ShippingWeightUnitDialog: React.FC<
  ShippingWeightUnitDialogProps
> = ({ open, onSubmit, onClose, onChange, defaultWeightUnit, disabled }) => {
  return (
    <Modal open={open} onChange={onChange}>
      <Modal.Content>
        {/* TODO: Add onInteractOutside={onClose} */}
        <Box
          __left="50%"
          __maxWidth="400px"
          __top="50%"
          __transform="translate(-50%, -50%)"
          backgroundColor="surfaceNeutralPlain"
          boxShadow="modal"
          position="fixed"
          padding={4}
          borderRadius={3}
        >
          <Box
            alignItems="center"
            display="flex"
            gap={3}
            justifyContent="space-between"
          >
            <Text variant="body" size="large">
              <FormattedMessage
                description="weight config modal title"
                defaultMessage="Default weight unit configuration"
                id="9WmA6z"
              />
            </Text>
            <Modal.Close>
              <Button
                icon={<CloseIcon />}
                size="small"
                variant="tertiary"
                onClick={onClose}
              />
            </Modal.Close>
          </Box>
          <ShippingWeightUnitForm
            defaultWeightUnit={defaultWeightUnit}
            onSubmit={onSubmit}
            disabled={disabled}
          />
        </Box>
      </Modal.Content>
    </Modal>
  );
};

export default ShippingWeightUnitDialog;
