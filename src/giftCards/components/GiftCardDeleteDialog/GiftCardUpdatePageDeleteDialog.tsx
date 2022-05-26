import { GIFT_CARD_LIST_QUERY } from "@saleor/giftCards/GiftCardsList/queries";
import useGiftCardDetails from "@saleor/giftCards/GiftCardUpdate/providers/GiftCardDetailsProvider/hooks/useGiftCardDetails";
import { DialogProps } from "@saleor/types";
import React from "react";

import GiftCardDeleteDialogContent from "./GiftCardDeleteDialogContent";
import useGiftCardSingleDelete from "./useGiftCardSingleDelete";

type GiftCardUpdatePageDeleteDialogProps = DialogProps & {
  onDelete: () => void;
};

const GiftCardUpdatePageDeleteDialog: React.FC<GiftCardUpdatePageDeleteDialogProps> = ({
  onClose,
  open,
  onDelete,
}) => {
  const { giftCard } = useGiftCardDetails();

  const { onDeleteGiftCard, deleteGiftCardOpts } = useGiftCardSingleDelete({
    id: giftCard?.id,
    onClose,
    onSuccess: onDelete,
    refetchQueries: [GIFT_CARD_LIST_QUERY],
  });

  return (
    <GiftCardDeleteDialogContent
      singleDeletion
      giftCard={giftCard}
      open={open}
      onClose={onClose}
      onConfirm={onDeleteGiftCard}
      confirmButtonState={deleteGiftCardOpts?.status}
    />
  );
};

export default GiftCardUpdatePageDeleteDialog;
