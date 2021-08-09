import { DialogContentText, Typography } from "@material-ui/core";
import ActionDialog, {
  ActionDialogProps
} from "@saleor/components/ActionDialog";
import DeleteWarningDialogConsentContent from "@saleor/components/TypeDeleteWarningDialog/DeleteWarningDialogConsentContent";
import useGiftCardList from "@saleor/giftCards/GiftCardsList/hooks/useGiftCardList";
import useGiftCardListBulkActions from "@saleor/giftCards/GiftCardsList/hooks/useGiftCardListBulkActions";
import { getById } from "@saleor/orders/components/OrderReturnPage/utils";
import React, { useEffect, useState } from "react";
import { useIntl } from "react-intl";

import { giftCardDeleteDialogMessages as messages } from "./messages";

export const SINGLE_COUNT = 1;

interface GiftCardDeleteDialogContentProps
  extends Pick<
    ActionDialogProps,
    "open" | "onClose" | "onConfirm" | "confirmButtonState"
  > {
  id?: string;
}

const GiftCardDeleteDialogContent: React.FC<GiftCardDeleteDialogContentProps> = ({
  id,
  open,
  onClose,
  onConfirm,
  confirmButtonState
}) => {
  const intl = useIntl();

  const { listElements, selectedItemsCount } = useGiftCardListBulkActions();
  const { giftCards } = useGiftCardList();

  const [isConsentChecked, setConsentChecked] = useState(false);

  useEffect(() => {
    if (!open) {
      setConsentChecked(false);
    }
  }, [open]);

  const isSingleDelete = !!id;

  const counterVariables = {
    counter: isSingleDelete ? SINGLE_COUNT : selectedItemsCount
  };

  const hasSelectedAnyGiftCardsWithBalance = () => {
    if (!giftCards || !selectedItemsCount) {
      return false;
    }

    return listElements?.some(hasSelectedGiftCardBalance);
  };

  const hasSelectedGiftCardBalance = (id: string) => {
    const giftCard = giftCards?.find(getById(id));

    return giftCard?.currentBalance?.amount > 0;
  };

  const deletingCardsWithBalance = isSingleDelete
    ? hasSelectedGiftCardBalance(id)
    : hasSelectedAnyGiftCardsWithBalance();

  return (
    <ActionDialog
      open={open}
      onClose={onClose}
      variant="delete"
      title={intl.formatMessage(messages.title, counterVariables)}
      onConfirm={onConfirm}
      confirmButtonState={confirmButtonState}
      disabled={!isConsentChecked}
    >
      {deletingCardsWithBalance ? (
        <DeleteWarningDialogConsentContent
          description={intl.formatMessage(
            messages.withBalanceDescription,
            counterVariables
          )}
          consentLabel={intl.formatMessage(
            messages.consentLabel,
            counterVariables
          )}
          isConsentChecked={isConsentChecked}
          onConsentChange={setConsentChecked}
        />
      ) : (
        <DialogContentText>
          <Typography>
            {intl.formatMessage(messages.defaultDescription, {
              ...counterVariables,
              selectedQuantity: selectedItemsCount
            })}
          </Typography>
        </DialogContentText>
      )}
    </ActionDialog>
  );
};

export default GiftCardDeleteDialogContent;
