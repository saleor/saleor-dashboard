import DialogContentText from "@material-ui/core/DialogContentText";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import ActionDialog from "@saleor/components/ActionDialog";
import DeleteFilterTabDialog from "@saleor/components/DeleteFilterTabDialog";
import SaveFilterTabDialog, {
  SaveFilterTabDialogFormData
} from "@saleor/components/SaveFilterTabDialog";
import { WindowTitle } from "@saleor/components/WindowTitle";
import useBulkActions from "@saleor/hooks/useBulkActions";
import useListSettings from "@saleor/hooks/useListSettings";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import usePaginator, {
  createPaginationState
} from "@saleor/hooks/usePaginator";
import useShop from "@saleor/hooks/useShop";
import { commonMessages, sectionNames } from "@saleor/intl";
import { getMutationState, maybe } from "@saleor/misc";
import { ListViews } from "@saleor/types";
import VoucherListPage from "../../components/VoucherListPage";
import { TypedVoucherBulkDelete } from "../../mutations";
import { TypedVoucherList } from "../../queries";
import { VoucherBulkDelete } from "../../types/VoucherBulkDelete";
import {
  voucherAddUrl,
  voucherListUrl,
  VoucherListUrlDialog,
  VoucherListUrlFilters,
  VoucherListUrlQueryParams,
  voucherUrl
} from "../../urls";
import {
  areFiltersApplied,
  deleteFilterTab,
  getActiveFilters,
  getFilterTabs,
  getFilterVariables,
  saveFilterTab
} from "./filter";

interface VoucherListProps {
  params: VoucherListUrlQueryParams;
}

export const VoucherList: React.StatelessComponent<VoucherListProps> = ({
  params
}) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const paginate = usePaginator();
  const shop = useShop();
  const { isSelected, listElements, reset, toggle, toggleAll } = useBulkActions(
    params.ids
  );
  const { updateListSettings, settings } = useListSettings(
    ListViews.VOUCHER_LIST
  );
  const intl = useIntl();

  const tabs = getFilterTabs();

  const currentTab =
    params.activeTab === undefined
      ? areFiltersApplied(params)
        ? tabs.length + 1
        : 0
      : parseInt(params.activeTab, 0);

  const changeFilterField = (filter: VoucherListUrlFilters) => {
    reset();
    navigate(
      voucherListUrl({
        ...getActiveFilters(params),
        ...filter,
        activeTab: undefined
      })
    );
  };

  const closeModal = () =>
    navigate(
      voucherListUrl({
        ...params,
        action: undefined,
        ids: undefined
      }),
      true
    );

  const openModal = (action: VoucherListUrlDialog, ids?: string[]) =>
    navigate(
      voucherListUrl({
        ...params,
        action,
        ids
      })
    );

  const handleTabChange = (tab: number) => {
    reset();
    navigate(
      voucherListUrl({
        activeTab: tab.toString(),
        ...getFilterTabs()[tab - 1].data
      })
    );
  };

  const handleTabDelete = () => {
    deleteFilterTab(currentTab);
    reset();
    navigate(voucherListUrl());
  };

  const handleTabSave = (data: SaveFilterTabDialogFormData) => {
    saveFilterTab(data.name, getActiveFilters(params));
    handleTabChange(tabs.length + 1);
  };

  const paginationState = createPaginationState(settings.rowNumber, params);
  const queryVariables = React.useMemo(
    () => ({
      ...paginationState,
      filter: getFilterVariables(params)
    }),
    [params]
  );

  const canOpenBulkActionDialog = maybe(() => params.ids.length > 0);

  return (
    <TypedVoucherList displayLoader variables={queryVariables}>
      {({ data, loading, refetch }) => {
        const { loadNextPage, loadPreviousPage, pageInfo } = paginate(
          maybe(() => data.vouchers.pageInfo),
          paginationState,
          params
        );

        const handleVoucherBulkDelete = (data: VoucherBulkDelete) => {
          if (data.voucherBulkDelete.errors.length === 0) {
            notify({
              text: intl.formatMessage(commonMessages.savedChanges)
            });
            reset();
            closeModal();
            refetch();
          }
        };

        return (
          <TypedVoucherBulkDelete onCompleted={handleVoucherBulkDelete}>
            {(voucherBulkDelete, voucherBulkDeleteOpts) => {
              const bulkRemoveTransitionState = getMutationState(
                voucherBulkDeleteOpts.called,
                voucherBulkDeleteOpts.loading,
                maybe(() => voucherBulkDeleteOpts.data.voucherBulkDelete.errors)
              );
              const onVoucherBulkDelete = () =>
                voucherBulkDelete({
                  variables: {
                    ids: params.ids
                  }
                });
              return (
                <>
                  <WindowTitle
                    title={intl.formatMessage(sectionNames.vouchers)}
                  />
                  <VoucherListPage
                    currentTab={currentTab}
                    initialSearch={params.query || ""}
                    onSearchChange={query => changeFilterField({ query })}
                    onAll={() => navigate(voucherListUrl())}
                    onTabChange={handleTabChange}
                    onTabDelete={() => openModal("delete-search")}
                    onTabSave={() => openModal("save-search")}
                    tabs={tabs.map(tab => tab.name)}
                    defaultCurrency={maybe(() => shop.defaultCurrency)}
                    settings={settings}
                    vouchers={maybe(() =>
                      data.vouchers.edges.map(edge => edge.node)
                    )}
                    disabled={loading}
                    pageInfo={pageInfo}
                    onAdd={() => navigate(voucherAddUrl)}
                    onNextPage={loadNextPage}
                    onPreviousPage={loadPreviousPage}
                    onUpdateListSettings={updateListSettings}
                    onRowClick={id => () => navigate(voucherUrl(id))}
                    isChecked={isSelected}
                    selected={listElements.length}
                    toggle={toggle}
                    toggleAll={toggleAll}
                    toolbar={
                      <IconButton
                        color="primary"
                        onClick={() =>
                          navigate(
                            voucherListUrl({
                              action: "remove",
                              ids: listElements
                            })
                          )
                        }
                      >
                        <DeleteIcon />
                      </IconButton>
                    }
                  />
                  <ActionDialog
                    confirmButtonState={bulkRemoveTransitionState}
                    onClose={closeModal}
                    onConfirm={onVoucherBulkDelete}
                    open={params.action === "remove" && canOpenBulkActionDialog}
                    title={intl.formatMessage({
                      defaultMessage: "Delete Vouchers",
                      description: "dialog header"
                    })}
                    variant="delete"
                  >
                    {canOpenBulkActionDialog && (
                      <DialogContentText>
                        <FormattedMessage
                          defaultMessage="Are you sure you want to delete {counter, plural,
                      one {this voucher}
                      other {{displayQuantity} vouchers}
                    }?"
                          description="dialog content"
                          values={{
                            counter: params.ids.length,
                            displayQuantity: (
                              <strong>{params.ids.length}</strong>
                            )
                          }}
                        />
                      </DialogContentText>
                    )}
                  </ActionDialog>
                  <SaveFilterTabDialog
                    open={params.action === "save-search"}
                    confirmButtonState="default"
                    onClose={closeModal}
                    onSubmit={handleTabSave}
                  />
                  <DeleteFilterTabDialog
                    open={params.action === "delete-search"}
                    confirmButtonState="default"
                    onClose={closeModal}
                    onSubmit={handleTabDelete}
                    tabName={maybe(() => tabs[currentTab - 1].name, "...")}
                  />
                </>
              );
            }}
          </TypedVoucherBulkDelete>
        );
      }}
    </TypedVoucherList>
  );
};
export default VoucherList;
