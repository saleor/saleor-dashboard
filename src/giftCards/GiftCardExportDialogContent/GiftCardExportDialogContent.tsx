import {
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@material-ui/core";
import ConfirmButton from "@saleor/components/ConfirmButton";
import { Task } from "@saleor/containers/BackgroundTasks/types";
import {
  useExportGiftCardsMutation,
  useGiftCardTotalCountQuery,
} from "@saleor/graphql";
import useBackgroundTask from "@saleor/hooks/useBackgroundTask";
import useForm from "@saleor/hooks/useForm";
import useNotifier from "@saleor/hooks/useNotifier";
import ExportDialogSettings from "@saleor/products/components/ProductExportDialog/ExportDialogSettings";
import {
  ExportSettingsFormData,
  exportSettingsInitialFormData,
  exportSettingsInitialFormDataWithIds,
} from "@saleor/products/components/ProductExportDialog/types";
import { DialogProps } from "@saleor/types";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import ContentWithProgress from "../GiftCardCreateDialog/ContentWithProgress";
import { useGiftCardList } from "../GiftCardsList/providers/GiftCardListProvider";
import { giftCardExportDialogMessages as messages } from "./messages";
import useStyles from "./styles";
import { getExportGiftCardsInput } from "./utils";

const GiftCardExportDialog: React.FC<Pick<DialogProps, "onClose"> & {
  idsToExport?: string[] | null;
}> = ({ onClose, idsToExport }) => {
  const intl = useIntl();
  const notify = useNotifier();
  const { queue } = useBackgroundTask();
  const classes = useStyles();

  const hasIdsToExport = !!idsToExport?.length;

  const {
    loading: loadingGiftCardList,
    totalCount: filteredGiftCardsCount,
    listElements,
  } = useGiftCardList();

  const selectedIds = idsToExport ?? listElements;

  const {
    data: allGiftCardsCountData,
    loading: loadingGiftCardCount,
  } = useGiftCardTotalCountQuery();

  const loading = loadingGiftCardList || loadingGiftCardCount;

  const [exportGiftCards, exportGiftCardsOpts] = useExportGiftCardsMutation({
    onCompleted: data => {
      const errors = data?.exportGiftCards?.errors;

      if (!errors.length) {
        notify({
          text: intl.formatMessage(messages.successAlertDescription),
          title: intl.formatMessage(messages.successAlertTitle),
        });

        queue(Task.EXPORT, {
          id: data.exportGiftCards.exportFile.id,
        });

        onClose();
      }
    },
  });

  const handleSubmit = (data: ExportSettingsFormData) => {
    exportGiftCards({
      variables: {
        input: getExportGiftCardsInput({
          data,
          ids: selectedIds,
        }),
      },
    });
  };

  const { data, change, submit } = useForm(
    hasIdsToExport
      ? exportSettingsInitialFormDataWithIds
      : exportSettingsInitialFormData,
    handleSubmit,
  );
  const allGiftCardsCount = allGiftCardsCountData?.giftCards?.totalCount;

  const exportScopeLabels = {
    allItems: intl.formatMessage(
      {
        id: "uQk8gB",
        defaultMessage: "All gift cards ({number})",
        description: "export all items to csv file",
      },
      {
        number: allGiftCardsCount || "...",
      },
    ),
    selectedItems: intl.formatMessage(
      {
        id: "n97Ii0",
        defaultMessage: "Selected giftCards ({number})",
        description: "export selected items to csv file",
      },
      {
        number: listElements.length,
      },
    ),
  };

  return (
    <>
      <DialogTitle>
        <FormattedMessage {...messages.title} />
      </DialogTitle>
      <DialogContent>
        <ContentWithProgress>
          {!loading && (
            <>
              <ExportDialogSettings
                errors={exportGiftCardsOpts?.data?.exportGiftCards?.errors}
                onChange={change}
                selectedItems={selectedIds?.length}
                data={data}
                exportScopeLabels={exportScopeLabels}
                allowScopeSelection={!hasIdsToExport}
                itemsQuantity={{
                  filter: filteredGiftCardsCount,
                  all: allGiftCardsCount,
                }}
              />
              <Typography className={classes.note} variant="body2">
                {intl.formatMessage(messages.exportNote)}
              </Typography>
            </>
          )}
        </ContentWithProgress>
      </DialogContent>
      <DialogActions>
        <ConfirmButton
          transitionState={exportGiftCardsOpts.status}
          variant="primary"
          type="submit"
          data-test="submit"
          onClick={submit}
        >
          <FormattedMessage {...messages.confirmButtonLabel} />
        </ConfirmButton>
      </DialogActions>
    </>
  );
};

export default GiftCardExportDialog;
