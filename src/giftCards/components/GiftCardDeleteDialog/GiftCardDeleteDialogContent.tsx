import ActionDialog, { ActionDialogProps } from "@dashboard/components/ActionDialog";
import DeleteWarningDialogConsentContent from "@dashboard/components/TypeDeleteWarningDialog/DeleteWarningDialogConsentContent";
import { GiftCardsListConsumerProps } from "@dashboard/giftCards/GiftCardsList/providers/GiftCardListProvider";
import { ExtendedGiftCard } from "@dashboard/giftCards/GiftCardUpdate/providers/GiftCardDetailsProvider/types";
import { GiftCardDataFragment } from "@dashboard/graphql";
import { getById } from "@dashboard/misc";
import { Box, Text } from "@saleor/macaw-ui-next";
import React, { useEffect, useMemo, useState } from "react";
import { useIntl } from "react-intl";

import { giftCardDeleteDialogMessages as messages } from "./messages";

export const SINGLE = 1;

type DeleteDialogContentGiftCard = Pick<
  ExtendedGiftCard<GiftCardDataFragment>,
  "currentBalance" | "id"
>;

interface GiftCardDeleteDialogContentProps<TGiftCard extends DeleteDialogContentGiftCard>
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
  const [isConsentChecked, setConsentChecked] = useState(false);
  const selectedItemsCount = useMemo(() => selectedRowIds?.length || SINGLE, [open]);

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
  const deletingCardsWithBalance = useMemo(
    () =>
      singleDeletion
        ? hasSelectedGiftCardBalance(ids?.[0] ?? "")
        : hasSelectedAnyGiftCardsWithBalance(),
    [open],
  );
  const submitEnabled = deletingCardsWithBalance ? isConsentChecked : true;

  return (
    <ActionDialog
      open={open}
      onClose={onClose}
      variant="delete"
      title={intl.formatMessage(messages.title, { selectedItemsCount })}
      onConfirm={onConfirm}
      confirmButtonState={loading ? "loading" : confirmButtonState}
      disabled={!submitEnabled}
    >
      {deletingCardsWithBalance ? (
        <Box display="flex" gap={6} flexDirection="column">
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
        </Box>
      ) : (
        <Text>
          {intl.formatMessage(messages.defaultDescription, {
            selectedItemsCount,
          })}
        </Text>
      )}
    </ActionDialog>
  );
}

export default GiftCardDeleteDialogContent;
