import { getGiftCardErrorMessage } from "@saleor/giftCards/GiftCardUpdate/messages";
import {
  DeleteGiftCardMutation,
  useDeleteGiftCardMutation,
} from "@saleor/graphql";
import { MutationResultWithOpts } from "@saleor/hooks/makeMutation";
import useNotifier from "@saleor/hooks/useNotifier";
import { useIntl } from "react-intl";

import { giftCardDeleteDialogMessages as messages } from "./messages";

interface UseGiftCardSingleDeleteProps {
  onDeleteGiftCard: () => void;
  deleteGiftCardOpts: MutationResultWithOpts<DeleteGiftCardMutation>;
}

const useGiftCardSingleDelete = ({
  id,
  onClose,
  refetchQueries,
  onSuccess,
}: {
  id: string;
  onClose: () => void;
  onSuccess?: () => void;
  refetchQueries?: string[];
}): UseGiftCardSingleDeleteProps => {
  const notify = useNotifier();
  const intl = useIntl();

  const [deleteGiftCard, deleteGiftCardOpts] = useDeleteGiftCardMutation({
    onCompleted: data => {
      const errors = data?.giftCardDelete?.errors;

      if (!errors.length) {
        notify({
          status: "success",
          text: intl.formatMessage(messages.deleteSuccessAlertText, {
            selectedItemsCount: 1,
          }),
        });

        onClose();

        if (onSuccess) {
          onSuccess();
        }

        return;
      }

      errors.map(error =>
        notify({
          status: "error",
          text: getGiftCardErrorMessage(error, intl),
        }),
      );
    },
    refetchQueries,
  });

  const onDeleteGiftCard = () => deleteGiftCard({ variables: { id } });

  return {
    onDeleteGiftCard,
    deleteGiftCardOpts,
  };
};

export default useGiftCardSingleDelete;
