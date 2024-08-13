import { ConfirmButton } from "@dashboard/components/ConfirmButton";
import { DashboardModal } from "@dashboard/components/Modal";
import { Task } from "@dashboard/containers/BackgroundTasks/types";
import { useExportGiftCardsMutation, useGiftCardTotalCountQuery } from "@dashboard/graphql";
import useBackgroundTask from "@dashboard/hooks/useBackgroundTask";
import useForm from "@dashboard/hooks/useForm";
import useNotifier from "@dashboard/hooks/useNotifier";
import ExportDialogSettings from "@dashboard/products/components/ProductExportDialog/ExportDialogSettings";
import {
  ExportSettingsFormData,
  exportSettingsInitialFormData,
  exportSettingsInitialFormDataWithIds,
} from "@dashboard/products/components/ProductExportDialog/types";
import { DialogProps } from "@dashboard/types";
import { Text } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import ContentWithProgress from "../GiftCardCreateDialog/ContentWithProgress";
import { useGiftCardList } from "../GiftCardsList/providers/GiftCardListProvider";
import { giftCardExportDialogMessages as messages } from "./messages";
import useStyles from "./styles";
import { getExportGiftCardsInput } from "./utils";

type IdsToExport = string[] | null;

const GiftCardExportDialog: React.FC<
  Pick<DialogProps, "onClose"> & {
    idsToExport?: IdsToExport;
  }
> = ({ onClose, idsToExport }) => {
  const intl = useIntl();
  const notify = useNotifier();
  const { queue } = useBackgroundTask();
  const classes = useStyles();
  const hasIdsToExport = !!idsToExport?.length;
  const {
    loading: loadingGiftCardList,
    totalCount: filteredGiftCardsCount,
    selectedRowIds,
  } = useGiftCardList();
  const selectedIds = idsToExport ?? selectedRowIds;
  const { data: allGiftCardsCountData, loading: loadingGiftCardCount } =
    useGiftCardTotalCountQuery();
  const loading = loadingGiftCardList || loadingGiftCardCount;
  const [exportGiftCards, exportGiftCardsOpts] = useExportGiftCardsMutation({
    onCompleted: data => {
      const errors = data?.exportGiftCards?.errors;

      if (!errors?.length) {
        notify({
          text: intl.formatMessage(messages.successAlertDescription),
          title: intl.formatMessage(messages.successAlertTitle),
        });
        queue(Task.EXPORT, {
          id: data?.exportGiftCards?.exportFile?.id,
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
    hasIdsToExport ? exportSettingsInitialFormDataWithIds : exportSettingsInitialFormData,
    handleSubmit,
  );
  const allGiftCardsCount = allGiftCardsCountData?.giftCards?.totalCount ?? 0;
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
        number: selectedRowIds.length,
      },
    ),
  };

  return (
    <DashboardModal.Content size="sm">
      <DashboardModal.Title>
        <FormattedMessage {...messages.title} />
      </DashboardModal.Title>

      <ContentWithProgress>
        {!loading && (
          <>
            <ExportDialogSettings
              errors={exportGiftCardsOpts?.data?.exportGiftCards?.errors ?? []}
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

            <Text className={classes.note} fontSize={3}>
              {intl.formatMessage(messages.exportNote)}
            </Text>
          </>
        )}
      </ContentWithProgress>

      <DashboardModal.Actions>
        <ConfirmButton
          transitionState={exportGiftCardsOpts.status}
          variant="primary"
          type="submit"
          data-test-id="submit"
          onClick={submit}
        >
          <FormattedMessage {...messages.confirmButtonLabel} />
        </ConfirmButton>
      </DashboardModal.Actions>
    </DashboardModal.Content>
  );
};

export default GiftCardExportDialog;
