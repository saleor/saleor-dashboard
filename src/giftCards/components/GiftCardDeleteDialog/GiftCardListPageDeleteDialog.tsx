import { ActionDialogProps } from "@saleor/components/ActionDialog";
import { useGiftCardListDialogs } from "@saleor/giftCards/GiftCardsList/providers/GiftCardListDialogsProvider";
import { useGiftCardList } from "@saleor/giftCards/GiftCardsList/providers/GiftCardListProvider";
import { GIFT_CARD_LIST_QUERY } from "@saleor/giftCards/GiftCardsList/queries";
import { DialogProps } from "@saleor/types";
import React from "react";

import GiftCardDeleteDialogContent, {
  SINGLE,
} from "./GiftCardDeleteDialogContent";
import useGiftCardBulkDelete from "./useGiftCardBulkDelete";
import useGiftCardSingleDelete from "./useGiftCardSingleDelete";

interface GiftCardDeleteDialogProps extends DialogProps {
  refetchQueries?: string[];
}

const GiftCardDeleteDialog: React.FC<GiftCardDeleteDialogProps> = ({
  open,
  onClose,
  refetchQueries = [],
}) => {
  const listProps = useGiftCardList();
  const { giftCards, loading, selectedItemsCount } = listProps;

  const { id } = useGiftCardListDialogs();

  const singleDeletion = !!id || selectedItemsCount === SINGLE;

  const { onDeleteGiftCard, deleteGiftCardOpts } = useGiftCardSingleDelete({
    id,
    onClose,
    refetchQueries: [GIFT_CARD_LIST_QUERY, ...refetchQueries],
  });

  const {
    onBulkDeleteGiftCards,
    bulkDeleteGiftCardOpts,
  } = useGiftCardBulkDelete({
    onClose,
    refetchQueries: [GIFT_CARD_LIST_QUERY, ...refetchQueries],
  });

  const dialogProps: Pick<
    ActionDialogProps,
    "onConfirm" | "confirmButtonState"
  > = !!id
    ? {
        onConfirm: onDeleteGiftCard,
        confirmButtonState: deleteGiftCardOpts?.status,
      }
    : {
        onConfirm: onBulkDeleteGiftCards,
        confirmButtonState: bulkDeleteGiftCardOpts?.status,
      };

  return (
    <GiftCardDeleteDialogContent
      {...listProps}
      {...dialogProps}
      id={id}
      open={open}
      onClose={onClose}
      singleDeletion={singleDeletion}
      giftCards={giftCards}
      loading={loading}
    />
  );
};

export default GiftCardDeleteDialog;
