import useGiftCardListDialogs from "@saleor/giftCards/GiftCardsList/providers/GiftCardListDialogsProvider/hooks/useGiftCardListDialogs";
import useGiftCardList from "@saleor/giftCards/GiftCardsList/providers/GiftCardListProvider/hooks/useGiftCardList";
import useGiftCardListBulkActions from "@saleor/giftCards/GiftCardsList/providers/GiftCardListProvider/hooks/useGiftCardListBulkActions";
import React from "react";

import GiftCardDeleteDialogContent, {
  GiftCardDeleteDialogContentProps,
  SINGLE
} from "./GiftCardDeleteDialogContent";
import useGiftCardBulkDelete from "./useGiftCardBulkDelete";
import useGiftCardSingleDelete from "./useGiftCardSingleDelete";

const GiftCardDeleteDialog: React.FC = () => {
  const giftCardBulkActionsProps = useGiftCardListBulkActions();
  const { selectedItemsCount } = giftCardBulkActionsProps;

  const { giftCards, loading } = useGiftCardList();

  const {
    closeDialog: onClose,
    isDeleteDialogOpen: open,
    id
  } = useGiftCardListDialogs();

  const singleDeletion = !!id || selectedItemsCount === SINGLE;

  const { onDeleteGiftCard, deleteGiftCardOpts } = useGiftCardSingleDelete({
    id,
    onClose,
    refetchQueries: ["GiftCardList"]
  });

  const {
    onBulkDeleteGiftCards,
    bulkDeleteGiftCardOpts
  } = useGiftCardBulkDelete({
    onClose,
    refetchQueries: ["GiftCardList"]
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
      onClose={onClose}
      singleDeletion={singleDeletion}
      giftCards={giftCards}
      loading={loading}
      {...giftCardBulkActionsProps}
      {...dialogProps}
    />
  );
};

export default GiftCardDeleteDialog;
