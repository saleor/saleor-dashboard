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

export interface OrderLineData {
  productName: string;
  variantName?: string;
  productSku?: string | null;
  quantity: number;
  thumbnail?: { url: string } | null;
}

interface OrderLineDiscountModalProps {
  open: boolean;
  maxPrice: MoneyFragment;
  lineData?: OrderLineData;
  existingDiscount?: OrderDiscountCommonInput;
  confirmStatus: ConfirmButtonTransitionState;
  removeStatus: ConfirmButtonTransitionState;
  onConfirm: (discount: OrderDiscountCommonInput) => void;
  onRemove: () => void;
  onClose: () => void;
}

export const OrderLineDiscountModal = ({
  open,
  maxPrice,
  lineData,
  existingDiscount,
  confirmStatus,
  removeStatus,
  onConfirm,
  onRemove,
  onClose,
}: OrderLineDiscountModalProps) => {
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
          <Box display="flex" gap={4} alignItems="center" overflow="hidden" __minWidth={0}>
            {lineData?.thumbnail?.url && (
              <Box
                as="img"
                src={lineData.thumbnail.url}
                alt=""
                __width="48px"
                __height="48px"
                objectFit="cover"
                borderRadius={2}
                flexShrink="0"
              />
            )}
            <Box display="flex" flexDirection="column" gap={0.5} overflow="hidden" __minWidth={0}>
              <Text size={5} fontWeight="bold">
                <FormattedMessage
                  defaultMessage="Line discount"
                  id="SIrDwV"
                  description="dialog title for order line discount"
                />
              </Text>
              {lineData && (
                <>
                  <Text size={2} color="default2" className={styles.truncatedText}>
                    {lineData.productName}
                    {lineData.variantName && ` · ${lineData.variantName}`}
                  </Text>
                  <Text size={2} color="default2" className={styles.truncatedText}>
                    {lineData.productSku && (
                      <>
                        <FormattedMessage defaultMessage="SKU" id="k4brJy" />
                        {`: ${lineData.productSku} · `}
                      </>
                    )}
                    <FormattedMessage defaultMessage="Qty" id="7gXPhB" />
                    {`: ${lineData.quantity}`}
                  </Text>
                </>
              )}
            </Box>
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
