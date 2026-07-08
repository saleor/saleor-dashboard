import BackButton from "@dashboard/components/BackButton";
import { useConditionalFilterContext } from "@dashboard/components/ConditionalFilter/context";
import { hasActiveListFilters } from "@dashboard/components/ConditionalFilter/hasActiveListFilters";
import { createGiftCardQueryVariables } from "@dashboard/components/ConditionalFilter/queryVariables";
import {
  ConfirmButton,
  type ConfirmButtonTransitionState,
} from "@dashboard/components/ConfirmButton";
import { DashboardModal } from "@dashboard/components/Modal";
import { SaleorThrobber } from "@dashboard/components/Throbber";
import { Task } from "@dashboard/containers/BackgroundTasks/types";
import { useExportGiftCardsMutation, useGiftCardTotalCountQuery } from "@dashboard/graphql";
import useBackgroundTask from "@dashboard/hooks/useBackgroundTask";
import useForm from "@dashboard/hooks/useForm";
import useModalDialogOpen from "@dashboard/hooks/useModalDialogOpen";
import { useNotifier } from "@dashboard/hooks/useNotifier";
import { buttonMessages } from "@dashboard/intl";
import {
  exportDialogScopeMessages,
  ExportDialogSettings,
  getFilteredItemsScopeLabel,
} from "@dashboard/products/components/ProductExportDialog/ExportDialogSettings";
import {
  type ExportSettingsFormData,
  exportSettingsInitialFormData,
  exportSettingsInitialFormDataWithIds,
} from "@dashboard/products/components/ProductExportDialog/types";
import { type DialogProps } from "@dashboard/types";
import { Box } from "@saleor/macaw-ui-next";
import { useMemo, useRef } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { useGiftCardList } from "../GiftCardsList/providers/GiftCardListProvider";
import { giftCardExportDialogMessages as messages } from "./messages";
import { getExportGiftCardsInput } from "./utils";

type IdsToExport = string[] | null;

interface GiftCardExportDialogContentProps extends Pick<DialogProps, "onClose" | "open"> {
  idsToExport?: IdsToExport;
}

export const GiftCardExportDialogContent = ({
  idsToExport,
  onClose,
  open,
}: GiftCardExportDialogContentProps) => {
  const intl = useIntl();
  const notify = useNotifier();
  const { queue } = useBackgroundTask();
  const { valueProvider } = useConditionalFilterContext();
  const hasIdsToExport = !!idsToExport?.length;
  const {
    loading: loadingGiftCardList,
    totalCount: filteredGiftCardsCount,
    selectedRowIds,
    params,
  } = useGiftCardList();
  const hasListFilters = useMemo(
    () =>
      hasActiveListFilters({
        filterContainer: valueProvider.value,
        searchQuery: params.query,
        createFilterVariables: createGiftCardQueryVariables,
      }),
    [params.query, valueProvider.value],
  );
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
  const { data, change, submit, reset } = useForm(
    hasIdsToExport ? exportSettingsInitialFormDataWithIds : exportSettingsInitialFormData,
    handleSubmit,
  );

  useModalDialogOpen(open, {
    onClose: () => {
      reset();
    },
  });

  const allGiftCardsCount = allGiftCardsCountData?.giftCards?.totalCount ?? 0;
  const exportScopeLabels = {
    allItems: intl.formatMessage(messages.allGiftCards, {
      number: allGiftCardsCount || "...",
    }),
    selectedItems: intl.formatMessage(messages.selectedGiftCards, {
      number: selectedIds?.length ?? 0,
    }),
    filteredItems: getFilteredItemsScopeLabel(intl, filteredGiftCardsCount),
  };
  const confirmButtonState: ConfirmButtonTransitionState = exportGiftCardsOpts.status;
  const isSubmittingRef = useRef(false);
  const isSubmitting = confirmButtonState === "loading";

  isSubmittingRef.current = isSubmitting;

  const handleModalClose = (): void => {
    if (isSubmittingRef.current) {
      return;
    }

    onClose();
  };

  return (
    <DashboardModal onChange={handleModalClose} open={open}>
      {open ? (
        <DashboardModal.Content size="sm">
          <DashboardModal.ContextHeader
            description={
              <FormattedMessage
                {...(hasIdsToExport ? messages.descriptionSelectedOnly : messages.description)}
              />
            }
          >
            <FormattedMessage {...messages.title} />
          </DashboardModal.ContextHeader>

          <DashboardModal.Body fill>
            <DashboardModal.Inset>
              {loading ? (
                <Box display="flex" alignItems="center" justifyContent="center" padding={6}>
                  <SaleorThrobber />
                </Box>
              ) : (
                <ExportDialogSettings
                  allowScopeSelection={!hasIdsToExport}
                  data={data}
                  errors={exportGiftCardsOpts?.data?.exportGiftCards?.errors ?? []}
                  exportScopeLabels={exportScopeLabels}
                  hasListFilters={hasListFilters}
                  onChange={change}
                  scopeSectionMessage={exportDialogScopeMessages.giftCardsToInclude}
                  selectedItems={selectedIds?.length ?? 0}
                />
              )}
            </DashboardModal.Inset>
          </DashboardModal.Body>

          <DashboardModal.Actions>
            <BackButton disabled={isSubmitting || loading} onClick={handleModalClose}>
              <FormattedMessage {...buttonMessages.cancel} />
            </BackButton>
            <ConfirmButton
              data-test-id="submit"
              disabled={isSubmitting || loading}
              onClick={submit}
              transitionState={confirmButtonState}
              type="submit"
              variant="primary"
            >
              <FormattedMessage {...messages.confirmButtonLabel} />
            </ConfirmButton>
          </DashboardModal.Actions>
        </DashboardModal.Content>
      ) : null}
    </DashboardModal>
  );
};

GiftCardExportDialogContent.displayName = "GiftCardExportDialogContent";
