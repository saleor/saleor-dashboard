import DeleteFilterTabDialog from "@dashboard/components/DeleteFilterTabDialog";
import SaveFilterTabDialog from "@dashboard/components/SaveFilterTabDialog";
import { useShopLimitsQuery } from "@dashboard/components/Shop/queries";
import { WindowTitle } from "@dashboard/components/WindowTitle";
import { useWarehouseDeleteMutation, useWarehouseListQuery } from "@dashboard/graphql";
import { useFilterPresets } from "@dashboard/hooks/useFilterPresets";
import useListSettings from "@dashboard/hooks/useListSettings";
import useNavigator from "@dashboard/hooks/useNavigator";
import useNotifier from "@dashboard/hooks/useNotifier";
import { usePaginationReset } from "@dashboard/hooks/usePaginationReset";
import usePaginator, {
  createPaginationState,
  PaginatorContext,
} from "@dashboard/hooks/usePaginator";
import { commonMessages, sectionNames } from "@dashboard/intl";
import { getById, getMutationStatus } from "@dashboard/misc";
import { ListViews } from "@dashboard/types";
import createDialogActionHandlers from "@dashboard/utils/handlers/dialogActionHandlers";
import createFilterHandlers from "@dashboard/utils/handlers/filterHandlers";
import createSortHandler from "@dashboard/utils/handlers/sortHandler";
import { mapEdgesToItems } from "@dashboard/utils/maps";
import { getSortParams } from "@dashboard/utils/sort";
import WarehouseDeleteDialog from "@dashboard/warehouses/components/WarehouseDeleteDialog";
import WarehouseListPage from "@dashboard/warehouses/components/WarehouseListPage";
import {
  warehouseListUrl,
  WarehouseListUrlDialog,
  WarehouseListUrlQueryParams,
} from "@dashboard/warehouses/urls";
import React from "react";
import { useIntl } from "react-intl";

import { getFilterVariables, storageUtils } from "./filters";
import { getSortQueryVariables } from "./sort";

export interface WarehouseListProps {
  params: WarehouseListUrlQueryParams;
}

const WarehouseList: React.FC<WarehouseListProps> = ({ params }) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const { updateListSettings, settings } = useListSettings(ListViews.SALES_LIST);
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
      if (data?.deleteWarehouse?.errors.length === 0) {
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

  const [, resetFilters, handleSearchChange] = createFilterHandlers({
    createUrl: warehouseListUrl,
    getFilterQueryParam: async () => undefined,
    navigate,
    params,
  });

  const [openModal, closeModal] = createDialogActionHandlers<
    WarehouseListUrlDialog,
    WarehouseListUrlQueryParams
  >(navigate, warehouseListUrl, params);

  const paginationValues = usePaginator({
    pageInfo: data?.warehouses?.pageInfo,
    paginationState,
    queryString: params,
  });

  const {
    selectedPreset,
    presets,
    hasPresetsChanged,
    onPresetChange,
    onPresetDelete,
    onPresetSave,
    onPresetUpdate,
    setPresetIdToDelete,
    getPresetNameToDelete,
  } = useFilterPresets({
    params,
    reset: resetFilters,
    getUrl: warehouseListUrl,
    storageUtils,
  });

  const handleSort = createSortHandler(navigate, warehouseListUrl, params);
  const deleteTransitionState = getMutationStatus(deleteWarehouseOpts);

  return (
    <PaginatorContext.Provider value={paginationValues}>
      <WindowTitle title={intl.formatMessage(sectionNames.warehouses)} />
      <WarehouseListPage
        currentTab={selectedPreset}
        initialSearch={params.query || ""}
        onSearchChange={handleSearchChange}
        onAll={resetFilters}
        onTabChange={onPresetChange}
        onTabDelete={(id: number) => {
          setPresetIdToDelete(id);
          openModal("delete-search");
        }}
        onTabSave={() => openModal("save-search")}
        limits={limitOpts.data?.shop.limits}
        onTabUpdate={onPresetUpdate}
        tabs={presets.map(tab => tab.name)}
        warehouses={mapEdgesToItems(data?.warehouses)}
        settings={settings}
        disabled={loading}
        onRemove={id => openModal("delete", { id })}
        onSort={handleSort}
        onUpdateListSettings={updateListSettings}
        sort={getSortParams(params)}
        hasPresetsChanged={hasPresetsChanged}
      />
      {!!params.id && (
        <WarehouseDeleteDialog
          confirmButtonState={deleteTransitionState}
          name={mapEdgesToItems(data?.warehouses)?.find(getById(params.id))?.name ?? ""}
          open={params.action === "delete"}
          onClose={closeModal}
          onConfirm={() =>
            deleteWarehouse({
              variables: {
                id: params.id!,
              },
            })
          }
        />
      )}
      <SaveFilterTabDialog
        open={params.action === "save-search"}
        confirmButtonState="default"
        onClose={closeModal}
        onSubmit={onPresetSave}
      />
      <DeleteFilterTabDialog
        open={params.action === "delete-search"}
        confirmButtonState="default"
        onClose={closeModal}
        onSubmit={onPresetDelete}
        tabName={getPresetNameToDelete()}
      />
    </PaginatorContext.Provider>
  );
};

WarehouseList.displayName = "WarehouseList";
export default WarehouseList;
