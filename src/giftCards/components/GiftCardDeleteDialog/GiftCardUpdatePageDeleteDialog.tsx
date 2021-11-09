import { GIFT_CARD_LIST_QUERY } from "@saleor/giftCards/GiftCardsList/types";
import useGiftCardDetails from "@saleor/giftCards/GiftCardUpdate/providers/GiftCardDetailsProvider/hooks/useGiftCardDetails";
import { GiftCardUpdateDialogsConsumerProps } from "@saleor/giftCards/GiftCardUpdate/providers/GiftCardUpdateDialogsProvider";
import { DialogActionHandlersProps } from "@saleor/utils/handlers/dialogActionHandlers";
import React from "react";

import GiftCardDeleteDialogContent from "./GiftCardDeleteDialogContent";
import useGiftCardSingleDelete from "./useGiftCardSingleDelete";

type GiftCardUpdatePageDeleteDialogProps = DialogActionHandlersProps &
  Pick<GiftCardUpdateDialogsConsumerProps, "navigateBack">;

const GiftCardUpdatePageDeleteDialog: React.FC<GiftCardUpdatePageDeleteDialogProps> = ({
  closeDialog,
  open,
  navigateBack
}) => {
  const { giftCard } = useGiftCardDetails();

  const { onDeleteGiftCard, deleteGiftCardOpts } = useGiftCardSingleDelete({
    id: giftCard?.id,
    onClose: closeDialog,
    onSuccess: navigateBack,
    refetchQueries: [GIFT_CARD_LIST_QUERY]
  });

  return (
    <GiftCardDeleteDialogContent
      singleDeletion
      giftCard={giftCard}
      open={open}
      onClose={closeDialog}
      onConfirm={onDeleteGiftCard}
      confirmButtonState={deleteGiftCardOpts?.status}
    />
  );
};

export default GiftCardUpdatePageDeleteDialog;
