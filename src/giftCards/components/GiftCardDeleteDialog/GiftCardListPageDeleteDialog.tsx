import useGiftCardListDialogs from "@saleor/giftCards/GiftCardsList/providers/GiftCardListDialogsProvider/hooks/useGiftCardListDialogs";
import useGiftCardList from "@saleor/giftCards/GiftCardsList/providers/GiftCardListProvider/hooks/useGiftCardList";
import useGiftCardListBulkActions from "@saleor/giftCards/GiftCardsList/providers/GiftCardListProvider/hooks/useGiftCardListBulkActions";
import { GIFT_CARD_LIST_QUERY } from "@saleor/giftCards/GiftCardsList/types";
import { DialogActionHandlersProps } from "@saleor/utils/handlers/dialogActionHandlers";
import React from "react";

import GiftCardDeleteDialogContent, {
  GiftCardDeleteDialogContentProps,
  SINGLE
} from "./GiftCardDeleteDialogContent";
import useGiftCardBulkDelete from "./useGiftCardBulkDelete";
import useGiftCardSingleDelete from "./useGiftCardSingleDelete";

const GiftCardDeleteDialog: React.FC<DialogActionHandlersProps> = ({
  open,
  closeDialog
}) => {
  const giftCardBulkActionsProps = useGiftCardListBulkActions();
  const { selectedItemsCount } = giftCardBulkActionsProps;

  const { giftCards, loading } = useGiftCardList();

  const { id } = useGiftCardListDialogs();

  const singleDeletion = !!id || selectedItemsCount === SINGLE;

  const { onDeleteGiftCard, deleteGiftCardOpts } = useGiftCardSingleDelete({
    id,
    onClose: closeDialog,
    refetchQueries: [GIFT_CARD_LIST_QUERY]
  });

  const {
    onBulkDeleteGiftCards,
    bulkDeleteGiftCardOpts
  } = useGiftCardBulkDelete({
    onClose: closeDialog,
    refetchQueries: [GIFT_CARD_LIST_QUERY]
  });

  const dialogProps: Pick<
    GiftCardDeleteDialogContentProps,
    "onConfirm" | "confirmButtonState"
  > = singleDeletion
    ? {
        onConfirm: onDeleteGiftCard,
        confirmButtonState: deleteGiftCardOpts?.status
      }
    : {
        onConfirm: onBulkDeleteGiftCards,
        confirmButtonState: bulkDeleteGiftCardOpts?.status
      };

  return (
    <GiftCardDeleteDialogContent
      id={id}
      open={open}
      onClose={closeDialog}
      singleDeletion={singleDeletion}
      giftCards={giftCards}
      loading={loading}
      {...giftCardBulkActionsProps}
      {...dialogProps}
    />
  );
};

export default GiftCardDeleteDialog;
