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
import SaleListPage from "../../components/SaleListPage";
import { TypedSaleBulkDelete } from "../../mutations";
import { TypedSaleList } from "../../queries";
import { SaleBulkDelete } from "../../types/SaleBulkDelete";
import {
  saleAddUrl,
  saleListUrl,
  SaleListUrlDialog,
  SaleListUrlFilters,
  SaleListUrlQueryParams,
  saleUrl
} from "../../urls";
import {
  areFiltersApplied,
  deleteFilterTab,
  getActiveFilters,
  getFilterTabs,
  getFilterVariables,
  saveFilterTab
} from "./filter";

interface SaleListProps {
  params: SaleListUrlQueryParams;
}

export const SaleList: React.StatelessComponent<SaleListProps> = ({
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
    ListViews.SALES_LIST
  );
  const intl = useIntl();

  const tabs = getFilterTabs();

  const currentTab =
    params.activeTab === undefined
      ? areFiltersApplied(params)
        ? tabs.length + 1
        : 0
      : parseInt(params.activeTab, 0);

  const changeFilterField = (filter: SaleListUrlFilters) => {
    reset();
    navigate(
      saleListUrl({
        ...getActiveFilters(params),
        ...filter,
        activeTab: undefined
      })
    );
  };

  const closeModal = () =>
    navigate(
      saleListUrl({
        ...params,
        action: undefined,
        ids: undefined
      }),
      true
    );

  const openModal = (action: SaleListUrlDialog, ids?: string[]) =>
    navigate(
      saleListUrl({
        ...params,
        action,
        ids
      })
    );

  const handleTabChange = (tab: number) => {
    reset();
    navigate(
      saleListUrl({
        activeTab: tab.toString(),
        ...getFilterTabs()[tab - 1].data
      })
    );
  };

  const handleTabDelete = () => {
    deleteFilterTab(currentTab);
    reset();
    navigate(saleListUrl());
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
    <TypedSaleList displayLoader variables={queryVariables}>
      {({ data, loading, refetch }) => {
        const { loadNextPage, loadPreviousPage, pageInfo } = paginate(
          maybe(() => data.sales.pageInfo),
          paginationState,
          params
        );

        const handleSaleBulkDelete = (data: SaleBulkDelete) => {
          if (data.saleBulkDelete.errors.length === 0) {
            notify({
              text: intl.formatMessage(commonMessages.savedChanges)
            });
            reset();
            closeModal();
            refetch();
          }
        };

        return (
          <TypedSaleBulkDelete onCompleted={handleSaleBulkDelete}>
            {(saleBulkDelete, saleBulkDeleteOpts) => {
              const bulkRemoveTransitionState = getMutationState(
                saleBulkDeleteOpts.called,
                saleBulkDeleteOpts.loading,
                maybe(() => saleBulkDeleteOpts.data.saleBulkDelete.errors)
              );
              const onSaleBulkDelete = () =>
                saleBulkDelete({
                  variables: {
                    ids: params.ids
                  }
                });

              return (
                <>
                  <WindowTitle title={intl.formatMessage(sectionNames.sales)} />
                  <SaleListPage
                    currentTab={currentTab}
                    initialSearch={params.query || ""}
                    onSearchChange={query => changeFilterField({ query })}
                    onAll={() => navigate(saleListUrl())}
                    onTabChange={handleTabChange}
                    onTabDelete={() => openModal("delete-search")}
                    onTabSave={() => openModal("save-search")}
                    tabs={tabs.map(tab => tab.name)}
                    defaultCurrency={maybe(() => shop.defaultCurrency)}
                    sales={maybe(() => data.sales.edges.map(edge => edge.node))}
                    settings={settings}
                    disabled={loading}
                    pageInfo={pageInfo}
                    onAdd={() => navigate(saleAddUrl)}
                    onNextPage={loadNextPage}
                    onPreviousPage={loadPreviousPage}
                    onUpdateListSettings={updateListSettings}
                    onRowClick={id => () => navigate(saleUrl(id))}
                    isChecked={isSelected}
                    selected={listElements.length}
                    toggle={toggle}
                    toggleAll={toggleAll}
                    toolbar={
                      <IconButton
                        color="primary"
                        onClick={() =>
                          navigate(
                            saleListUrl({
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
                    onConfirm={onSaleBulkDelete}
                    open={params.action === "remove" && canOpenBulkActionDialog}
                    title={intl.formatMessage({
                      defaultMessage: "Delete Sales",
                      description: "dialog header"
                    })}
                    variant="delete"
                  >
                    {canOpenBulkActionDialog && (
                      <DialogContentText>
                        <FormattedMessage
                          defaultMessage="Are you sure you want to delete {counter, plural,
                                    one {this sale}
                                    other {{displayQuantity} sales}
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
          </TypedSaleBulkDelete>
        );
      }}
    </TypedSaleList>
  );
};
export default SaleList;
