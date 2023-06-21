// @ts-strict-ignore
import ActionDialog from "@dashboard/components/ActionDialog";
import useAppChannel from "@dashboard/components/AppLayout/AppChannelContext";
import DeleteFilterTabDialog from "@dashboard/components/DeleteFilterTabDialog";
import SaveFilterTabDialog, {
  SaveFilterTabDialogFormData,
} from "@dashboard/components/SaveFilterTabDialog";
import { WindowTitle } from "@dashboard/components/WindowTitle";
import {
  useSaleBulkDeleteMutation,
  useSaleListQuery,
} from "@dashboard/graphql";
import useBulkActions from "@dashboard/hooks/useBulkActions";
import useListSettings from "@dashboard/hooks/useListSettings";
import useNavigator from "@dashboard/hooks/useNavigator";
import useNotifier from "@dashboard/hooks/useNotifier";
import { usePaginationReset } from "@dashboard/hooks/usePaginationReset";
import usePaginator, {
  createPaginationState,
  PaginatorContext,
} from "@dashboard/hooks/usePaginator";
import { commonMessages } from "@dashboard/intl";
import { maybe } from "@dashboard/misc";
import { ListViews } from "@dashboard/types";
import createDialogActionHandlers from "@dashboard/utils/handlers/dialogActionHandlers";
import createFilterHandlers from "@dashboard/utils/handlers/filterHandlers";
import createSortHandler from "@dashboard/utils/handlers/sortHandler";
import { mapEdgesToItems, mapNodeToChoice } from "@dashboard/utils/maps";
import { getSortParams } from "@dashboard/utils/sort";
import { DialogContentText } from "@material-ui/core";
import { DeleteIcon, IconButton } from "@saleor/macaw-ui";
import React, { useEffect } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import SaleListPage from "../../components/SaleListPage";
import {
  saleListUrl,
  SaleListUrlDialog,
  SaleListUrlQueryParams,
} from "../../urls";
import {
  deleteFilterTab,
  getActiveFilters,
  getFilterOpts,
  getFilterQueryParam,
  getFiltersCurrentTab,
  getFilterTabs,
  getFilterVariables,
  saveFilterTab,
} from "./filters";
import { canBeSorted, DEFAULT_SORT_KEY, getSortQueryVariables } from "./sort";

interface SaleListProps {
  params: SaleListUrlQueryParams;
}

export const SaleList: React.FC<SaleListProps> = ({ params }) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const { isSelected, listElements, reset, toggle, toggleAll } = useBulkActions(
    params.ids,
  );
  const { updateListSettings, settings } = useListSettings(
    ListViews.SALES_LIST,
  );

  usePaginationReset(saleListUrl, params, settings.rowNumber);

  const intl = useIntl();
  const { availableChannels } = useAppChannel(false);
  const selectedChannel = availableChannels.find(
    channel => channel.slug === params.channel,
  );
  const channelOpts = availableChannels
    ? mapNodeToChoice(availableChannels, channel => channel.slug)
    : null;

  const [openModal, closeModal] = createDialogActionHandlers<
    SaleListUrlDialog,
    SaleListUrlQueryParams
  >(navigate, saleListUrl, params);

  const paginationState = createPaginationState(settings.rowNumber, params);
  const queryVariables = React.useMemo(
    () => ({
      ...paginationState,
      filter: getFilterVariables(params),
      sort: getSortQueryVariables(params),
      channel: params.channel,
    }),
    [params, settings.rowNumber],
  );
  const { data, loading, refetch } = useSaleListQuery({
    displayLoader: true,
    variables: queryVariables,
  });

  const tabs = getFilterTabs();

  const currentTab = getFiltersCurrentTab(params, tabs);

  const [changeFilters, resetFilters, handleSearchChange] =
    createFilterHandlers({
      cleanupFn: reset,
      createUrl: saleListUrl,
      getFilterQueryParam,
      navigate,
      params,
    });

  useEffect(() => {
    if (!canBeSorted(params.sort, !!selectedChannel)) {
      navigate(
        saleListUrl({
          ...params,
          sort: DEFAULT_SORT_KEY,
        }),
      );
    }
  }, [params]);

  const handleTabChange = (tab: number) => {
    reset();
    navigate(
      saleListUrl({
        activeTab: tab.toString(),
        ...getFilterTabs()[tab - 1].data,
      }),
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

  const paginationValues = usePaginator({
    pageInfo: maybe(() => data.sales.pageInfo),
    paginationState,
    queryString: params,
  });

  const [saleBulkDelete, saleBulkDeleteOpts] = useSaleBulkDeleteMutation({
    onCompleted: data => {
      if (data.saleBulkDelete.errors.length === 0) {
        notify({
          status: "success",
          text: intl.formatMessage(commonMessages.savedChanges),
        });
        reset();
        closeModal();
        refetch();
      }
    },
  });

  const handleSort = createSortHandler(navigate, saleListUrl, params);

  const onSaleBulkDelete = () =>
    saleBulkDelete({
      variables: {
        ids: params.ids,
      },
    });

  return (
    <PaginatorContext.Provider value={paginationValues}>
      <WindowTitle title={intl.formatMessage(commonMessages.discounts)} />
      <SaleListPage
        currentTab={currentTab}
        filterOpts={getFilterOpts(params, channelOpts)}
        initialSearch={params.query || ""}
        onSearchChange={handleSearchChange}
        onFilterChange={filter => changeFilters(filter)}
        onAll={resetFilters}
        onTabChange={handleTabChange}
        onTabDelete={() => openModal("delete-search")}
        onTabSave={() => openModal("save-search")}
        tabs={tabs.map(tab => tab.name)}
        sales={mapEdgesToItems(data?.sales)}
        settings={settings}
        disabled={loading}
        onSort={handleSort}
        onUpdateListSettings={updateListSettings}
        isChecked={isSelected}
        selected={listElements.length}
        sort={getSortParams(params)}
        toggle={toggle}
        toggleAll={toggleAll}
        toolbar={
          <IconButton
            variant="secondary"
            color="primary"
            onClick={() =>
              openModal("remove", {
                ids: listElements,
              })
            }
          >
            <DeleteIcon />
          </IconButton>
        }
        selectedChannelId={selectedChannel?.id}
      />
      <ActionDialog
        confirmButtonState={saleBulkDeleteOpts.status}
        onClose={closeModal}
        onConfirm={onSaleBulkDelete}
        open={params.action === "remove" && canOpenBulkActionDialog}
        title={intl.formatMessage({
          id: "ZWIjvr",
          defaultMessage: "Delete Sales",
          description: "dialog header",
        })}
        variant="delete"
      >
        {canOpenBulkActionDialog && (
          <DialogContentText>
            <FormattedMessage
              id="FPzzh7"
              defaultMessage="{counter,plural,one{Are you sure you want to delete this sale?} other{Are you sure you want to delete {displayQuantity} sales?}}"
              description="dialog content"
              values={{
                counter: params.ids.length,
                displayQuantity: <strong>{params.ids.length}</strong>,
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
    </PaginatorContext.Provider>
  );
};
export default SaleList;
