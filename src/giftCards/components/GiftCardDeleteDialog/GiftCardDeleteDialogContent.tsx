import BackButton from "@dashboard/components/BackButton";
import {
  ConfirmButton,
  type ConfirmButtonTransitionState,
} from "@dashboard/components/ConfirmButton";
import { DashboardModal } from "@dashboard/components/Modal";
import { type GiftCardsListConsumerProps } from "@dashboard/giftCards/GiftCardsList/providers/GiftCardListProvider";
import { type ExtendedGiftCard } from "@dashboard/giftCards/GiftCardUpdate/providers/GiftCardDetailsProvider/types";
import { type GiftCardDataFragment } from "@dashboard/graphql";
import { buttonMessages } from "@dashboard/intl";
import { getById } from "@dashboard/misc";
import { Checkbox, Text } from "@saleor/macaw-ui-next";
import { useEffect, useMemo, useState } from "react";
import { FormattedMessage } from "react-intl";

import { giftCardDeleteDialogMessages as messages } from "./messages";

export const SINGLE = 1;

type DeleteDialogContentGiftCard = Pick<
  ExtendedGiftCard<GiftCardDataFragment>,
  "currentBalance" | "id"
>;

interface GiftCardDeleteDialogContentProps<TGiftCard extends DeleteDialogContentGiftCard> {
  confirmButtonState: ConfirmButtonTransitionState;
  giftCard?: TGiftCard;
  giftCards?: GiftCardsListConsumerProps["giftCards"];
  ids?: string[];
  loading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
  open: boolean;
  selectedRowIds?: GiftCardsListConsumerProps["selectedRowIds"];
  singleDeletion: boolean;
}

const hasGiftCardBalance = (
  giftCards: GiftCardsListConsumerProps["giftCards"] | undefined,
  giftCard: DeleteDialogContentGiftCard | undefined,
  id: string,
): boolean => {
  const card = giftCards?.find(getById(id)) || giftCard;

  return (card?.currentBalance?.amount ?? 0) > 0;
};

export function GiftCardDeleteDialogContent<TGiftCard extends DeleteDialogContentGiftCard>({
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
  const [isConsentChecked, setConsentChecked] = useState(false);
  const selectedItemsCount = useMemo(
    () => selectedRowIds?.length ?? ids?.length ?? SINGLE,
    [ids, selectedRowIds],
  );

  useEffect(() => {
    if (!open) {
      setConsentChecked(false);
    }
  }, [open]);

  const deletingCardsWithBalance = useMemo(() => {
    if (singleDeletion) {
      return hasGiftCardBalance(giftCards, giftCard, ids?.[0] ?? "");
    }

    if (!giftCards || !selectedRowIds?.length) {
      return false;
    }

    return selectedRowIds.some(id => hasGiftCardBalance(giftCards, giftCard, id));
  }, [giftCard, giftCards, ids, selectedRowIds, singleDeletion]);

  const isSubmitting = loading || confirmButtonState === "loading";
  const submitEnabled = deletingCardsWithBalance ? isConsentChecked : true;

  const handleClose = (): void => {
    if (isSubmitting) {
      return;
    }

    onClose();
  };

  const subtitle = deletingCardsWithBalance ? (
    <FormattedMessage {...messages.withBalanceSubtitle} values={{ selectedItemsCount }} />
  ) : (
    <FormattedMessage {...messages.defaultDescription} values={{ selectedItemsCount }} />
  );

  return (
    <DashboardModal onChange={handleClose} open={open}>
      <DashboardModal.Content size="xs">
        <DashboardModal.Header subtitle={subtitle}>
          <FormattedMessage {...messages.title} values={{ selectedItemsCount }} />
        </DashboardModal.Header>

        {deletingCardsWithBalance ? (
          <DashboardModal.Body>
            <DashboardModal.Inset>
              <Checkbox
                checked={isConsentChecked}
                data-test-id="delete-assigned-items-consent"
                disabled={isSubmitting}
                name="delete-gift-cards-with-balance-consent"
                onCheckedChange={value => setConsentChecked(!!value)}
              >
                <Text>
                  <FormattedMessage {...messages.consentLabel} values={{ selectedItemsCount }} />
                </Text>
              </Checkbox>
            </DashboardModal.Inset>
          </DashboardModal.Body>
        ) : null}

        <DashboardModal.Actions>
          <BackButton disabled={isSubmitting} onClick={handleClose} />
          <ConfirmButton
            data-test-id="submit"
            disabled={!submitEnabled || isSubmitting}
            onClick={onConfirm}
            transitionState={loading ? "loading" : confirmButtonState}
            variant="error"
          >
            <FormattedMessage {...buttonMessages.delete} />
          </ConfirmButton>
        </DashboardModal.Actions>
      </DashboardModal.Content>
    </DashboardModal>
  );
}

GiftCardDeleteDialogContent.displayName = "GiftCardDeleteDialogContent";
