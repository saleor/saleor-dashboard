import DialogContentText from "@material-ui/core/DialogContentText";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import ActionDialog from "@saleor/components/ActionDialog";
import useAppChannel from "@saleor/components/AppLayout/AppChannelContext";
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
import { commonMessages, sectionNames } from "@saleor/intl";
import { maybe } from "@saleor/misc";
import { ListViews } from "@saleor/types";
import createDialogActionHandlers from "@saleor/utils/handlers/dialogActionHandlers";
import createFilterHandlers from "@saleor/utils/handlers/filterHandlers";
import createSortHandler from "@saleor/utils/handlers/sortHandler";
import { getSortParams } from "@saleor/utils/sort";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import SaleListPage from "../../components/SaleListPage";
import { TypedSaleBulkDelete } from "../../mutations";
import { useSaleListQuery } from "../../queries";
import { SaleBulkDelete } from "../../types/SaleBulkDelete";
import {
  saleAddUrl,
  saleListUrl,
  SaleListUrlDialog,
  SaleListUrlQueryParams,
  saleUrl
} from "../../urls";
import {
  areFiltersApplied,
  deleteFilterTab,
  getActiveFilters,
  getFilterOpts,
  getFilterQueryParam,
  getFilterTabs,
  getFilterVariables,
  saveFilterTab
} from "./filters";
import { getSortQueryVariables } from "./sort";

interface SaleListProps {
  params: SaleListUrlQueryParams;
}

export const SaleList: React.FC<SaleListProps> = ({ params }) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const paginate = usePaginator();
  const { isSelected, listElements, reset, toggle, toggleAll } = useBulkActions(
    params.ids
  );
  const { updateListSettings, settings } = useListSettings(
    ListViews.SALES_LIST
  );
  const intl = useIntl();
  const { channel } = useAppChannel();

  const [openModal, closeModal] = createDialogActionHandlers<
    SaleListUrlDialog,
    SaleListUrlQueryParams
  >(navigate, saleListUrl, params);

  const paginationState = createPaginationState(settings.rowNumber, params);
  const queryVariables = React.useMemo(
    () => ({
      ...paginationState,
      filter: getFilterVariables(params),
      sort: getSortQueryVariables(params)
    }),
    [params]
  );
  const { data, loading, refetch } = useSaleListQuery({
    displayLoader: true,
    variables: queryVariables
  });

  const tabs = getFilterTabs();

  const currentTab =
    params.activeTab === undefined
      ? areFiltersApplied(params)
        ? tabs.length + 1
        : 0
      : parseInt(params.activeTab, 0);

  const [
    changeFilters,
    resetFilters,
    handleSearchChange
  ] = createFilterHandlers({
    cleanupFn: reset,
    createUrl: saleListUrl,
    getFilterQueryParam,
    navigate,
    params
  });

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

  const canOpenBulkActionDialog = maybe(() => params.ids.length > 0);

  const { loadNextPage, loadPreviousPage, pageInfo } = paginate(
    maybe(() => data.sales.pageInfo),
    paginationState,
    params
  );

  const handleSaleBulkDelete = (data: SaleBulkDelete) => {
    if (data.saleBulkDelete.errors.length === 0) {
      notify({
        status: "success",
        text: intl.formatMessage(commonMessages.savedChanges)
      });
      reset();
      closeModal();
      refetch();
    }
  };

  const handleSort = createSortHandler(navigate, saleListUrl, params);

  return (
    <TypedSaleBulkDelete onCompleted={handleSaleBulkDelete}>
      {(saleBulkDelete, saleBulkDeleteOpts) => {
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
              filterOpts={getFilterOpts(params)}
              initialSearch={params.query || ""}
              onSearchChange={handleSearchChange}
              onFilterChange={filter => changeFilters(filter)}
              onAll={resetFilters}
              onTabChange={handleTabChange}
              onTabDelete={() => openModal("delete-search")}
              onTabSave={() => openModal("save-search")}
              tabs={tabs.map(tab => tab.name)}
              sales={maybe(() => data.sales.edges.map(edge => edge.node))}
              settings={settings}
              disabled={loading}
              pageInfo={pageInfo}
              onAdd={() => navigate(saleAddUrl())}
              onNextPage={loadNextPage}
              onPreviousPage={loadPreviousPage}
              onSort={handleSort}
              onUpdateListSettings={updateListSettings}
              onRowClick={id => () => navigate(saleUrl(id))}
              isChecked={isSelected}
              selected={listElements.length}
              sort={getSortParams(params)}
              toggle={toggle}
              toggleAll={toggleAll}
              toolbar={
                <IconButton
                  color="primary"
                  onClick={() =>
                    openModal("remove", {
                      ids: listElements
                    })
                  }
                >
                  <DeleteIcon />
                </IconButton>
              }
              selectedChannelId={channel.id}
            />
            <ActionDialog
              confirmButtonState={saleBulkDeleteOpts.status}
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
                    defaultMessage="{counter,plural,one{Are you sure you want to delete this sale?} other{Are you sure you want to delete {displayQuantity} sales?}}"
                    description="dialog content"
                    values={{
                      counter: params.ids.length,
                      displayQuantity: <strong>{params.ids.length}</strong>
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
};
export default SaleList;
