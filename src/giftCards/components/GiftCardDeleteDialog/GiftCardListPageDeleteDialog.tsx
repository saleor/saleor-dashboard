import { ActionDialogProps } from "@dashboard/components/ActionDialog";
import { useGiftCardList } from "@dashboard/giftCards/GiftCardsList/providers/GiftCardListProvider";
import { GIFT_CARD_LIST_QUERY } from "@dashboard/giftCards/GiftCardsList/queries";
import { DialogProps } from "@dashboard/types";
import React from "react";

import GiftCardDeleteDialogContent, { SINGLE } from "./GiftCardDeleteDialogContent";
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
  const { giftCards, loading, selectedRowIds, clearRowSelection } = listProps;
  const singleDeletion = selectedRowIds.length === SINGLE;
  const { onDeleteGiftCard, deleteGiftCardOpts } = useGiftCardSingleDelete({
    id: selectedRowIds[0],
    onClose,
    refetchQueries: [GIFT_CARD_LIST_QUERY, ...refetchQueries],
  });
  const { onBulkDeleteGiftCards, bulkDeleteGiftCardOpts } = useGiftCardBulkDelete({
    onClose,
    refetchQueries: [GIFT_CARD_LIST_QUERY, ...refetchQueries],
  });
  const dialogProps: Pick<ActionDialogProps, "onConfirm" | "confirmButtonState"> = singleDeletion
    ? {
        onConfirm: () => {
          onDeleteGiftCard();
          clearRowSelection();
        },
        confirmButtonState: deleteGiftCardOpts?.status,
      }
    : {
        onConfirm: () => {
          onBulkDeleteGiftCards();
          clearRowSelection();
        },
        confirmButtonState: bulkDeleteGiftCardOpts?.status,
      };

  return (
    <GiftCardDeleteDialogContent
      {...listProps}
      {...dialogProps}
      ids={selectedRowIds}
      open={open}
      onClose={onClose}
      singleDeletion={singleDeletion}
      giftCards={giftCards}
      loading={loading}
    />
  );
};

export default GiftCardDeleteDialog;
