import { ActionDialogProps } from "@saleor/components/ActionDialog";
import useGiftCardListDialogs from "@saleor/giftCards/GiftCardsList/providers/GiftCardListDialogsProvider/hooks/useGiftCardListDialogs";
import useGiftCardList from "@saleor/giftCards/GiftCardsList/providers/GiftCardListProvider/hooks/useGiftCardList";
import useGiftCardListBulkActions from "@saleor/giftCards/GiftCardsList/providers/GiftCardListProvider/hooks/useGiftCardListBulkActions";
import { GIFT_CARD_LIST_QUERY } from "@saleor/giftCards/GiftCardsList/types";
import { DialogProps } from "@saleor/types";
import React from "react";

import GiftCardDeleteDialogContent, {
  SINGLE
} from "./GiftCardDeleteDialogContent";
import useGiftCardBulkDelete from "./useGiftCardBulkDelete";
import useGiftCardSingleDelete from "./useGiftCardSingleDelete";

interface GiftCardDeleteDialogProps extends DialogProps {
  refetchQueries?: string[];
}

const GiftCardDeleteDialog: React.FC<GiftCardDeleteDialogProps> = ({
  open,
  onClose,
  refetchQueries = []
}) => {
  const giftCardBulkActionsProps = useGiftCardListBulkActions();
  const { selectedItemsCount } = giftCardBulkActionsProps;

  const { giftCards, loading } = useGiftCardList();

  const { id } = useGiftCardListDialogs();

  const singleDeletion = !!id || selectedItemsCount === SINGLE;

  const { onDeleteGiftCard, deleteGiftCardOpts } = useGiftCardSingleDelete({
    id,
    onClose,
    refetchQueries: [GIFT_CARD_LIST_QUERY, ...refetchQueries]
  });

  const {
    onBulkDeleteGiftCards,
    bulkDeleteGiftCardOpts
  } = useGiftCardBulkDelete({
    onClose,
    refetchQueries: [GIFT_CARD_LIST_QUERY, ...refetchQueries]
  });

  const dialogProps: Pick<
    ActionDialogProps,
    "onConfirm" | "confirmButtonState"
  > = !!id
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
