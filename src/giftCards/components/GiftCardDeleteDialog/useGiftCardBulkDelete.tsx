import { useGiftCardBulkDeleteMutation } from "@saleor/giftCards/GiftCardsList/mutations";
import useGiftCardListBulkActions from "@saleor/giftCards/GiftCardsList/providers/GiftCardListProvider/hooks/useGiftCardListBulkActions";
import { BulkDeleteGiftCard } from "@saleor/giftCards/GiftCardsList/types/BulkDeleteGiftCard";
import { MutationResultWithOpts } from "@saleor/hooks/makeMutation";
import useNotifier from "@saleor/hooks/useNotifier";
import commonErrorMessages from "@saleor/utils/errors/common";
import { useIntl } from "react-intl";

import { giftCardDeleteDialogMessages as messages } from "./messages";

interface UseGiftCardBulkDeleteProps {
  onBulkDeleteGiftCards: () => void;
  bulkDeleteGiftCardOpts: MutationResultWithOpts<BulkDeleteGiftCard>;
}

const useGiftCardBulkDelete = ({
  onClose,
  refetchQueries
}: {
  onClose: () => void;
  refetchQueries?: string[];
}): UseGiftCardBulkDeleteProps => {
  const notify = useNotifier();
  const intl = useIntl();

  const {
    listElements,
    selectedItemsCount,
    reset: resetSelectedItems
  } = useGiftCardListBulkActions();

  const onCompleted = (data: BulkDeleteGiftCard) => {
    const errors = data?.giftCardBulkDelete?.errors;

    if (!errors.length) {
      notify({
        status: "success",
        text: intl.formatMessage(messages.deleteSuccessAlertText, {
          selectedItemsCount
        })
      });

      onClose();
      resetSelectedItems();
      return;
    }

    notify({
      status: "error",
      text: intl.formatMessage(commonErrorMessages.unknownError)
    });
  };

  const [
    bulkDeleteGiftCard,
    bulkDeleteGiftCardOpts
  ] = useGiftCardBulkDeleteMutation({
    onCompleted,
    refetchQueries
  });

  const onBulkDeleteGiftCards = () =>
    bulkDeleteGiftCard({ variables: { ids: listElements } });

  return {
    onBulkDeleteGiftCards,
    bulkDeleteGiftCardOpts
  };
};

export default useGiftCardBulkDelete;
