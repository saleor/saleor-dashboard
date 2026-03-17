import BackButton from "@dashboard/components/BackButton";
import {
  ConfirmButton,
  type ConfirmButtonTransitionState,
} from "@dashboard/components/ConfirmButton";
import { DashboardModal } from "@dashboard/components/Modal";
import modalStyles from "@dashboard/components/Modal/DashboardModal.module.css";
import { type MoneyFragment } from "@dashboard/graphql";
import { buttonMessages } from "@dashboard/intl";
import { Box, Button, Modal } from "@saleor/macaw-ui-next";
import { X } from "lucide-react";
import { type ReactNode } from "react";
import { useIntl } from "react-intl";

import { DiscountFormFields } from "./DiscountFormFields";
import { type OrderDiscountCommonInput } from "./types";
import { useDiscountForm } from "./useDiscountForm";

interface DiscountModalBaseProps {
  open: boolean;
  maxPrice: MoneyFragment;
  existingDiscount?: OrderDiscountCommonInput;
  confirmStatus: ConfirmButtonTransitionState;
  removeStatus: ConfirmButtonTransitionState;
  onConfirm: (discount: OrderDiscountCommonInput) => void;
  onRemove: () => void;
  onClose: () => void;
  header: ReactNode;
}

export const DiscountModalBase = ({
  open,
  maxPrice,
  existingDiscount,
  confirmStatus,
  removeStatus,
  onConfirm,
  onRemove,
  onClose,
  header,
}: DiscountModalBaseProps) => {
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
      <DashboardModal.Content size="xs" className={modalStyles.modalContent}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="flex-start"
          gap={4}
          overflow="hidden"
        >
          {header}
          <Modal.Close>
            <Button
              data-test-id="close-button"
              icon={<X size={20} />}
              size="small"
              variant="tertiary"
              onClick={onClose}
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
