import { type ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import { useGiftCardList } from "@dashboard/giftCards/GiftCardsList/providers/GiftCardListProvider";
import { GIFT_CARD_LIST_QUERY } from "@dashboard/giftCards/GiftCardsList/queries";
import { type DialogProps } from "@dashboard/types";

import { GiftCardDeleteDialogContent, SINGLE } from "./GiftCardDeleteDialogContent";
import useGiftCardBulkDelete from "./useGiftCardBulkDelete";
import useGiftCardSingleDelete from "./useGiftCardSingleDelete";

interface GiftCardDeleteDialogProps extends DialogProps {
  refetchQueries?: string[];
}

export const GiftCardListPageDeleteDialog = ({
  open,
  onClose,
  refetchQueries = [],
}: GiftCardDeleteDialogProps) => {
  const listProps = useGiftCardList();
  const { giftCards, loading, selectedRowIds, clearRowSelection } = listProps;
  const singleDeletion = selectedRowIds.length === SINGLE;
  const { onDeleteGiftCard, deleteGiftCardOpts } = useGiftCardSingleDelete({
    id: selectedRowIds[0],
    onClose,
    onSuccess: clearRowSelection,
    refetchQueries: [GIFT_CARD_LIST_QUERY, ...refetchQueries],
  });
  const { onBulkDeleteGiftCards, bulkDeleteGiftCardOpts } = useGiftCardBulkDelete({
    onClose,
    refetchQueries: [GIFT_CARD_LIST_QUERY, ...refetchQueries],
  });
  const dialogProps: {
    confirmButtonState: ConfirmButtonTransitionState;
    onConfirm: () => void;
  } = singleDeletion
    ? {
        onConfirm: onDeleteGiftCard,
        confirmButtonState: deleteGiftCardOpts?.status,
      }
    : {
        onConfirm: onBulkDeleteGiftCards,
        confirmButtonState: bulkDeleteGiftCardOpts?.status,
      };

  const isLoading =
    loading ||
    deleteGiftCardOpts?.status === "loading" ||
    bulkDeleteGiftCardOpts?.status === "loading";

  return (
    <GiftCardDeleteDialogContent
      {...listProps}
      {...dialogProps}
      ids={selectedRowIds}
      open={open}
      onClose={onClose}
      singleDeletion={singleDeletion}
      giftCards={giftCards}
      loading={isLoading}
    />
  );
};

GiftCardListPageDeleteDialog.displayName = "GiftCardListPageDeleteDialog";
