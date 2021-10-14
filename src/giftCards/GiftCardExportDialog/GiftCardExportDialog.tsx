import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle
} from "@material-ui/core";
import ConfirmButton from "@saleor/components/ConfirmButton";
import { Task } from "@saleor/containers/BackgroundTasks/types";
import useBackgroundTask from "@saleor/hooks/useBackgroundTask";
import useForm from "@saleor/hooks/useForm";
import useNotifier from "@saleor/hooks/useNotifier";
import ExportDialogSettings from "@saleor/products/components/ProductExportDialog/ExportDialogSettings";
import {
  ExportSettingsFormData,
  exportSettingsInitialFormData
} from "@saleor/products/components/ProductExportDialog/types";
import { DialogActionHandlersProps } from "@saleor/utils/handlers/dialogActionHandlers";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import ContentWithProgress from "../GiftCardCreateDialog/ContentWithProgress";
import useGiftCardList from "../GiftCardsList/providers/GiftCardListProvider/hooks/useGiftCardList";
import useGiftCardListBulkActions from "../GiftCardsList/providers/GiftCardListProvider/hooks/useGiftCardListBulkActions";
import { useGiftCardTotalCountQuery } from "../GiftCardsList/queries";
import { giftCardExportDialogMessages as messages } from "./messages";
import { useGiftCardExportMutation } from "./mutations";
import { ExportGiftCards } from "./types/ExportGiftCards";

const GiftCardExportDialog: React.FC<DialogActionHandlersProps> = ({
  closeDialog,
  open
}) => {
  const intl = useIntl();
  const notify = useNotifier();
  const { queue } = useBackgroundTask();

  const {
    loading: loadingGiftCardList,
    totalCount: filteredGiftCardsCount
  } = useGiftCardList();

  const { listElements } = useGiftCardListBulkActions();

  const {
    data: allGiftCardsCountData,
    loading: loadingGiftCardCount
  } = useGiftCardTotalCountQuery();

  const loading = loadingGiftCardList || loadingGiftCardCount;

  const handleSubmitComplete = (data: ExportGiftCards) => {
    const errors = data?.exportGiftCards?.errors;

    if (!errors.length) {
      notify({
        text: intl.formatMessage(messages.successAlertDescription),
        title: intl.formatMessage(messages.successAlertTitle)
      });

      queue(Task.EXPORT, {
        id: data.exportGiftCards.exportFile.id
      });

      closeDialog();
    }
  };

  const [exportGiftCards, exportGiftCardsOpts] = useGiftCardExportMutation({
    onCompleted: handleSubmitComplete
  });

  const handleSubmit = (data: ExportSettingsFormData) => {
    exportGiftCards({
      variables: {
        input: {
          fileType: data?.fileType,
          scope: data?.scope
        }
      }
    });
  };

  const { data, change, submit } = useForm(
    exportSettingsInitialFormData,
    handleSubmit
  );

  return (
    <Dialog onClose={closeDialog} open={open} maxWidth="sm" fullWidth>
      <DialogTitle>
        <FormattedMessage {...messages.title} />
      </DialogTitle>
      <DialogContent>
        <ContentWithProgress>
          {!loading && (
            <ExportDialogSettings
              errors={exportGiftCardsOpts?.data?.exportGiftCards?.errors}
              onChange={change}
              selectedItems={listElements.length}
              itemsQuantity={{
                filter: filteredGiftCardsCount,
                all: allGiftCardsCountData?.giftCards?.totalCount
              }}
              data={data}
              exportTypeLabel={intl.formatMessage(messages.exportTypeLabel)}
            />
          )}
        </ContentWithProgress>
      </DialogContent>
      <DialogActions>
        <ConfirmButton
          transitionState={exportGiftCardsOpts.status}
          variant="contained"
          type="submit"
          data-test="submit"
          onClick={submit}
        >
          <FormattedMessage {...messages.confirmButtonLabel} />
        </ConfirmButton>
      </DialogActions>
    </Dialog>
  );
};

export default GiftCardExportDialog;
