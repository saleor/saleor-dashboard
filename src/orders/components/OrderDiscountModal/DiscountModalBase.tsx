import BackButton from "@dashboard/components/BackButton";
import {
  ConfirmButton,
  type ConfirmButtonTransitionState,
} from "@dashboard/components/ConfirmButton";
import { DashboardModal } from "@dashboard/components/Modal";
import { type MoneyFragment } from "@dashboard/graphql";
import { buttonMessages } from "@dashboard/intl";
import { Box } from "@saleor/macaw-ui-next";
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
  title: ReactNode;
  description?: ReactNode;
  wrapDescription?: boolean;
  preFormContent?: ReactNode;
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
  title,
  description,
  wrapDescription = true,
  preFormContent,
}: DiscountModalBaseProps) => {
  const intl = useIntl();

  const {
    control,
    valueFieldSymbol,
    valueErrorMsg,
    isSubmitDisabled,
    getDiscountData,
    onCalculationModeChange,
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
      <DashboardModal.Content size="xs">
        <DashboardModal.ContextHeader description={description} wrapDescription={wrapDescription}>
          {title}
        </DashboardModal.ContextHeader>

        <DashboardModal.Body>
          <DashboardModal.Inset>
            <Box display="flex" flexDirection="column" gap={5}>
              {preFormContent}
              <DiscountFormFields
                control={control}
                valueFieldSymbol={valueFieldSymbol}
                valueErrorMsg={valueErrorMsg}
                onCalculationModeChange={onCalculationModeChange}
              />
            </Box>
          </DashboardModal.Inset>
        </DashboardModal.Body>

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
