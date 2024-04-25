import ActionDialog, { ActionDialogProps } from "@dashboard/components/ActionDialog";
import DeleteWarningDialogConsentContent from "@dashboard/components/TypeDeleteWarningDialog/DeleteWarningDialogConsentContent";
import { GiftCardsListConsumerProps } from "@dashboard/giftCards/GiftCardsList/providers/GiftCardListProvider";
import { ExtendedGiftCard } from "@dashboard/giftCards/GiftCardUpdate/providers/GiftCardDetailsProvider/types";
import { GiftCardDataFragment } from "@dashboard/graphql";
import { getById } from "@dashboard/misc";
import { CircularProgress, DialogContentText, Typography } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useIntl } from "react-intl";

import { giftCardDeleteDialogMessages as messages } from "./messages";
import { useGiftCardDeleteDialogContentStyles as useStyles } from "./styles";

export const SINGLE = 1;

type DeleteDialogContentGiftCard = Pick<
  ExtendedGiftCard<GiftCardDataFragment>,
  "currentBalance" | "id"
>;

export interface GiftCardDeleteDialogContentProps<TGiftCard extends DeleteDialogContentGiftCard>
  extends Pick<ActionDialogProps, "open" | "onClose" | "onConfirm" | "confirmButtonState">,
    Partial<Pick<GiftCardsListConsumerProps, "selectedRowIds" | "giftCards" | "loading">> {
  ids?: string[];
  giftCard?: TGiftCard;
  singleDeletion: boolean;
}

function GiftCardDeleteDialogContent<TGiftCard extends DeleteDialogContentGiftCard>({
  ids,
  open,
  onClose,
  onConfirm,
  confirmButtonState,
  singleDeletion,
  selectedRowIds,
  giftCards,
  giftCard,
  loading,
}: GiftCardDeleteDialogContentProps<TGiftCard>) {
  const intl = useIntl();
  const classes = useStyles({});
  const [isConsentChecked, setConsentChecked] = useState(false);
  const selectedItemsCount = selectedRowIds?.length || SINGLE;

  useEffect(() => {
    if (!open) {
      setConsentChecked(false);
    }
  }, [open]);

  const hasSelectedAnyGiftCardsWithBalance = () => {
    if (!giftCards) {
      return false;
    }

    return selectedRowIds?.some(hasSelectedGiftCardBalance);
  };
  const hasSelectedGiftCardBalance = (id: string) => {
    const card = giftCards?.find(getById(id)) || giftCard;

    return (card?.currentBalance?.amount ?? 0) > 0;
  };
  const deletingCardsWithBalance = singleDeletion
    ? hasSelectedGiftCardBalance(ids?.[0] ?? "")
    : hasSelectedAnyGiftCardsWithBalance();
  const submitEnabled = deletingCardsWithBalance ? isConsentChecked : true;

  return (
    <ActionDialog
      open={open}
      onClose={onClose}
      variant="delete"
      title={intl.formatMessage(messages.title, { selectedItemsCount })}
      onConfirm={onConfirm}
      confirmButtonState={confirmButtonState}
      disabled={!submitEnabled}
    >
      {loading ? (
        <div className={classes.progressContainer}>
          <CircularProgress />
        </div>
      ) : deletingCardsWithBalance ? (
        <DeleteWarningDialogConsentContent
          isConsentChecked={isConsentChecked}
          onConsentChange={setConsentChecked}
          description={intl.formatMessage(messages.withBalanceDescription, {
            selectedItemsCount,
          })}
          consentLabel={intl.formatMessage(messages.consentLabel, {
            selectedItemsCount,
          })}
        />
      ) : (
        <DialogContentText>
          <Typography>
            {intl.formatMessage(messages.defaultDescription, {
              selectedItemsCount,
            })}
          </Typography>
        </DialogContentText>
      )}
    </ActionDialog>
  );
}

export default GiftCardDeleteDialogContent;
