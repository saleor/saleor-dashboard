import DeleteFilterTabDialog from "@saleor/components/DeleteFilterTabDialog";
import SaveFilterTabDialog, {
  SaveFilterTabDialogFormData,
} from "@saleor/components/SaveFilterTabDialog";
import { useShopLimitsQuery } from "@saleor/components/Shop/queries";
import { WindowTitle } from "@saleor/components/WindowTitle";
import {
  useWarehouseDeleteMutation,
  useWarehouseListQuery,
} from "@saleor/graphql";
import useListSettings from "@saleor/hooks/useListSettings";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import { usePaginationReset } from "@saleor/hooks/usePaginationReset";
import usePaginator, {
  createPaginationState,
  PaginatorContext,
} from "@saleor/hooks/usePaginator";
import { commonMessages, sectionNames } from "@saleor/intl";
import { getMutationStatus, maybe } from "@saleor/misc";
import { getById } from "@saleor/orders/components/OrderReturnPage/utils";
import { ListViews } from "@saleor/types";
import createDialogActionHandlers from "@saleor/utils/handlers/dialogActionHandlers";
import createFilterHandlers from "@saleor/utils/handlers/filterHandlers";
import createSortHandler from "@saleor/utils/handlers/sortHandler";
import { mapEdgesToItems } from "@saleor/utils/maps";
import { getSortParams } from "@saleor/utils/sort";
import WarehouseDeleteDialog from "@saleor/warehouses/components/WarehouseDeleteDialog";
import WarehouseListPage from "@saleor/warehouses/components/WarehouseListPage";
import {
  warehouseListUrl,
  WarehouseListUrlDialog,
  WarehouseListUrlQueryParams,
} from "@saleor/warehouses/urls";
import React from "react";
import { useIntl } from "react-intl";

import {
  deleteFilterTab,
  getActiveFilters,
  getFiltersCurrentTab,
  getFilterTabs,
  getFilterVariables,
  saveFilterTab,
} from "./filters";
import { getSortQueryVariables } from "./sort";

export interface WarehouseListProps {
  params: WarehouseListUrlQueryParams;
}

const WarehouseList: React.FC<WarehouseListProps> = ({ params }) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const { updateListSettings, settings } = useListSettings(
    ListViews.SALES_LIST,
  );
  const intl = useIntl();

  usePaginationReset(warehouseListUrl, params, settings.rowNumber);

  const paginationState = createPaginationState(settings.rowNumber, params);
  const queryVariables = React.useMemo(
    () => ({
      ...paginationState,
      filter: getFilterVariables(params),
      sort: getSortQueryVariables(params),
    }),
    [params, settings.rowNumber],
  );
  const { data, loading, refetch } = useWarehouseListQuery({
    displayLoader: true,
    variables: queryVariables,
  });
  const limitOpts = useShopLimitsQuery({
    variables: {
      warehouses: true,
    },
  });
  const [deleteWarehouse, deleteWarehouseOpts] = useWarehouseDeleteMutation({
    onCompleted: data => {
      if (data.deleteWarehouse.errors.length === 0) {
        notify({
          status: "success",
          text: intl.formatMessage(commonMessages.savedChanges),
        });
        refetch();
        limitOpts.refetch();
        closeModal();
      }
    },
  });

  const tabs = getFilterTabs();

  const currentTab = getFiltersCurrentTab(params, tabs);

  const [, resetFilters, handleSearchChange] = createFilterHandlers({
    createUrl: warehouseListUrl,
    getFilterQueryParam: () => undefined,
    navigate,
    params,
  });

  const [openModal, closeModal] = createDialogActionHandlers<
    WarehouseListUrlDialog,
    WarehouseListUrlQueryParams
  >(navigate, warehouseListUrl, params);

  const handleTabChange = (tab: number) =>
    navigate(
      warehouseListUrl({
        activeTab: tab.toString(),
        ...getFilterTabs()[tab - 1].data,
      }),
    );

  const handleTabDelete = () => {
    deleteFilterTab(currentTab);
    navigate(warehouseListUrl());
  };

  const handleTabSave = (data: SaveFilterTabDialogFormData) => {
    saveFilterTab(data.name, getActiveFilters(params));
    handleTabChange(tabs.length + 1);
  };

  const paginationValues = usePaginator({
    pageInfo: maybe(() => data.warehouses.pageInfo),
    paginationState,
    queryString: params,
  });

  const handleSort = createSortHandler(navigate, warehouseListUrl, params);

  const deleteTransitionState = getMutationStatus(deleteWarehouseOpts);

  return (
    <PaginatorContext.Provider value={paginationValues}>
      <WindowTitle title={intl.formatMessage(sectionNames.warehouses)} />
      <WarehouseListPage
        currentTab={currentTab}
        initialSearch={params.query || ""}
        onSearchChange={handleSearchChange}
        onAll={resetFilters}
        onTabChange={handleTabChange}
        onTabDelete={() => openModal("delete-search")}
        onTabSave={() => openModal("save-search")}
        limits={limitOpts.data?.shop.limits}
        tabs={tabs.map(tab => tab.name)}
        warehouses={mapEdgesToItems(data?.warehouses)}
        settings={settings}
        disabled={loading}
        onRemove={id => openModal("delete", { id })}
        onSort={handleSort}
        onUpdateListSettings={updateListSettings}
        sort={getSortParams(params)}
      />
      <WarehouseDeleteDialog
        confirmButtonState={deleteTransitionState}
        name={mapEdgesToItems(data?.warehouses)?.find(getById(params.id))?.name}
        open={params.action === "delete"}
        onClose={closeModal}
        onConfirm={() =>
          deleteWarehouse({
            variables: {
              id: params.id,
            },
          })
        }
      />
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

WarehouseList.displayName = "WarehouseList";
export default WarehouseList;
