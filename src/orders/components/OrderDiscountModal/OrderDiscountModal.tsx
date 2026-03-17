import BackButton from "@dashboard/components/BackButton";
import {
  ConfirmButton,
  type ConfirmButtonTransitionState,
} from "@dashboard/components/ConfirmButton";
import { DashboardModal } from "@dashboard/components/Modal";
import { type MoneyFragment } from "@dashboard/graphql";
import { buttonMessages } from "@dashboard/intl";
import { Box, Button, Modal, Text } from "@saleor/macaw-ui-next";
import { X } from "lucide-react";
import { FormattedMessage, useIntl } from "react-intl";

import { type OrderDiscountCommonInput } from "../OrderDiscountCommonModal/types";
import { DiscountFormFields } from "./DiscountFormFields";
import styles from "./OrderDiscountModal.module.css";
import { useDiscountForm } from "./useDiscountForm";

interface OrderDiscountModalProps {
  open: boolean;
  maxPrice: MoneyFragment;
  existingDiscount?: OrderDiscountCommonInput;
  confirmStatus: ConfirmButtonTransitionState;
  removeStatus: ConfirmButtonTransitionState;
  onConfirm: (discount: OrderDiscountCommonInput) => void;
  onRemove: () => void;
  onClose: () => void;
}

export const OrderDiscountModal = ({
  open,
  maxPrice,
  existingDiscount,
  confirmStatus,
  removeStatus,
  onConfirm,
  onRemove,
  onClose,
}: OrderDiscountModalProps) => {
  const intl = useIntl();

  const {
    value,
    reason,
    calculationMode,
    valueErrorMsg,
    valueFieldSymbol,
    isSubmitDisabled,
    handleSetDiscountValue,
    handleSetReason,
    handleSetCalculationMode,
    getDiscountData,
  } = useDiscountForm({
    maxPrice,
    existingDiscount,
    isOpen: open,
  });

  const handleConfirm = () => {
    onConfirm(getDiscountData());
  };

  return (
    <DashboardModal open={open} onChange={onClose}>
      <DashboardModal.Content size="xs" className={styles.modalContent}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="flex-start"
          gap={4}
          overflow="hidden"
        >
          <Box display="flex" flexDirection="column" gap={0.5} overflow="hidden" __minWidth={0}>
            <Text size={5} fontWeight="bold">
              <FormattedMessage
                defaultMessage="Order discount"
                id="oO2fji"
                description="dialog title for order discount"
              />
            </Text>
            <Text size={2} color="default2">
              <FormattedMessage
                defaultMessage="Discount this order by a percentage or fixed amount"
                id="ous0aA"
                description="dialog subtitle for order discount"
              />
            </Text>
          </Box>
          <Modal.Close>
            <Button
              data-test-id="close-button"
              icon={<X size={20} />}
              size="small"
              variant="tertiary"
              onClick={() => onClose()}
              flexShrink="0"
            />
          </Modal.Close>
        </Box>

        <DiscountFormFields
          value={value}
          reason={reason}
          calculationMode={calculationMode}
          valueErrorMsg={valueErrorMsg}
          valueFieldSymbol={valueFieldSymbol}
          onValueChange={handleSetDiscountValue}
          onReasonChange={handleSetReason}
          onCalculationModeChange={handleSetCalculationMode}
        />

        <DashboardModal.Actions>
          {existingDiscount && (
            <ConfirmButton
              data-test-id="button-remove"
              onClick={onRemove}
              variant="error"
              transitionState={removeStatus}
            >
              {intl.formatMessage(buttonMessages.remove)}
            </ConfirmButton>
          )}
          <Box flexGrow="1" />
          <BackButton onClick={onClose}>{intl.formatMessage(buttonMessages.cancel)}</BackButton>
          <ConfirmButton
            disabled={isSubmitDisabled}
            transitionState={confirmStatus}
            onClick={handleConfirm}
            variant="primary"
            data-test-id="submit"
          >
            {intl.formatMessage(buttonMessages.confirm)}
          </ConfirmButton>
        </DashboardModal.Actions>
      </DashboardModal.Content>
    </DashboardModal>
  );
};
