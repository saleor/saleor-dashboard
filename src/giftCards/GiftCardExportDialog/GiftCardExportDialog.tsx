import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle
} from "@material-ui/core";
import useForm from "@saleor/hooks/useForm";
import { ConfirmButton } from "@saleor/macaw-ui";
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

const GiftCardExportDialog: React.FC<DialogActionHandlersProps> = ({
  closeDialog,
  open
}) => {
  const intl = useIntl();
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

  const [exportGiftCards, exportGiftCardsOpts] = useGiftCardExportMutation({});

  const handleSubmit = (data: ExportSettingsFormData) => {
    exportGiftCards({
      variables: {
        fileType: data?.fileType,
        scope: data?.scope
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
          transitionState={confirmButtonState}
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
