import { ActionDialogProps } from "@saleor/components/ActionDialog";
import useGiftCardListBulkActions from "@saleor/giftCards/GiftCardsList/hooks/useGiftCardListBulkActions";
import {
  useGiftCardBulkDeleteMutation,
  useGiftCardDeleteMutation
} from "@saleor/giftCards/GiftCardsList/mutations";
import { BulkDeleteGiftCard } from "@saleor/giftCards/GiftCardsList/types/BulkDeleteGiftCard";
import {
  DeleteGiftCard,
  DeleteGiftCard_giftCardDelete_errors
} from "@saleor/giftCards/GiftCardsList/types/DeleteGiftCard";
import { getGiftCardErrorMessage } from "@saleor/giftCards/GiftCardUpdatePage/messages";
import useNotifier from "@saleor/hooks/useNotifier";
import commonErrorMessages from "@saleor/utils/errors/common";
import React from "react";
import { useIntl } from "react-intl";

import GiftCardDeleteDialogContent, {
  SINGLE_COUNT
} from "./GiftCardDeleteDialogContent";
import { giftCardDeleteDialogMessages as messages } from "./messages";

interface GiftCardDeleteDialogProps
  extends Pick<ActionDialogProps, "open" | "onClose"> {
  id?: string;
}

const GiftCardDeleteDialog: React.FC<GiftCardDeleteDialogProps> = ({
  open,
  onClose,
  id
}) => {
  const intl = useIntl();
  const notify = useNotifier();

  const {
    listElements,
    selectedItemsCount,
    reset: resetSelectedItems
  } = useGiftCardListBulkActions();

  const isSingleDelete = !!id;

  const onSingleDeleteCompleted = (data: DeleteGiftCard) => {
    const errors = data?.giftCardDelete?.errors;

    if (!errors.length) {
      notify({
        status: "success",
        text: intl.formatMessage(messages.deleteSuccessAlertText, {
          counter: SINGLE_COUNT
        })
      });

      onClose();
      return;
    }

    errors.map((error: DeleteGiftCard_giftCardDelete_errors) =>
      notify({
        status: "error",
        text: getGiftCardErrorMessage(error, intl)
      })
    );
  };

  const onBulkDeleteCompleted = (data: BulkDeleteGiftCard) => {
    const errors = data?.giftCardBulkDelete?.errors;

    if (!errors.length) {
      notify({
        status: "success",
        text: intl.formatMessage(messages.deleteSuccessAlertText, {
          counter: selectedItemsCount
        })
      });

      onClose();
      return;
    }

    notify({
      status: "error",
      text: intl.formatMessage(commonErrorMessages.unknownError)
    });
  };

  const [deleteGiftCard, deleteGiftCardOpts] = useGiftCardDeleteMutation({
    onCompleted: onSingleDeleteCompleted
  });

  const [
    bulkDeleteGiftCard,
    bulkDeleteGiftCardOpts
  ] = useGiftCardBulkDeleteMutation({
    onCompleted: onBulkDeleteCompleted
  });

  const handleGiftCardDelete = () => deleteGiftCard({ variables: { id } });

  const handleBulkGiftCardDelete = () =>
    bulkDeleteGiftCard({ variables: { ids: listElements } });

  const dialogProps = isSingleDelete
    ? {
        onConfirm: handleGiftCardDelete,
        confirmButtonState: deleteGiftCardOpts?.status
      }
    : {
        onConfirm: handleBulkGiftCardDelete,
        confirmButtonState: bulkDeleteGiftCardOpts?.status
      };

  const handleClose = () => {
    resetSelectedItems();
    onClose();
  };

  return (
    <GiftCardDeleteDialogContent
      id={id}
      open={open}
      onClose={handleClose}
      {...dialogProps}
    />
  );
};

export default GiftCardDeleteDialog;
