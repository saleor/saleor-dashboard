import {
  getFilterOpts,
  getFilterVariables,
  storageUtils,
} from "@dashboard/attributes/views/AttributeList/filters";
import DeleteFilterTabDialog from "@dashboard/components/DeleteFilterTabDialog";
import SaveFilterTabDialog from "@dashboard/components/SaveFilterTabDialog";
import { useAttributeBulkDeleteMutation, useAttributeListQuery } from "@dashboard/graphql";
import { useFilterPresets } from "@dashboard/hooks/useFilterPresets";
import useListSettings from "@dashboard/hooks/useListSettings";
import useNavigator from "@dashboard/hooks/useNavigator";
import useNotifier from "@dashboard/hooks/useNotifier";
import { usePaginationReset } from "@dashboard/hooks/usePaginationReset";
import usePaginator, {
  createPaginationState,
  PaginatorContext,
} from "@dashboard/hooks/usePaginator";
import { useRowSelection } from "@dashboard/hooks/useRowSelection";
import { ListViews } from "@dashboard/types";
import createDialogActionHandlers from "@dashboard/utils/handlers/dialogActionHandlers";
import createFilterHandlers from "@dashboard/utils/handlers/filterHandlers";
import createSortHandler from "@dashboard/utils/handlers/sortHandler";
import { mapEdgesToItems } from "@dashboard/utils/maps";
import { getSortParams } from "@dashboard/utils/sort";
import isEqual from "lodash/isEqual";
import React, { useCallback } from "react";
import { useIntl } from "react-intl";

import AttributeBulkDeleteDialog from "../../components/AttributeBulkDeleteDialog";
import AttributeListPage from "../../components/AttributeListPage";
import { attributeListUrl, AttributeListUrlDialog, AttributeListUrlQueryParams } from "../../urls";
import { getFilterQueryParam } from "./filters";
import { getSortQueryVariables } from "./sort";

interface AttributeListProps {
  params: AttributeListUrlQueryParams;
}

const AttributeList: React.FC<AttributeListProps> = ({ params }) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const intl = useIntl();
  const { updateListSettings, settings } = useListSettings(ListViews.ATTRIBUTE_LIST);

  usePaginationReset(attributeListUrl, params, settings.rowNumber);

  const paginationState = createPaginationState(settings.rowNumber, params);
  const queryVariables = React.useMemo(
    () => ({
      ...paginationState,
      filter: getFilterVariables(params),
      sort: getSortQueryVariables(params),
    }),
    [params, settings.rowNumber],
  );
  const { data, loading, refetch } = useAttributeListQuery({
    variables: queryVariables,
  });
  const {
    clearRowSelection,
    selectedRowIds,
    setSelectedRowIds,
    setClearDatagridRowSelectionCallback,
  } = useRowSelection(params);
  const {
    hasPresetsChanged,
    onPresetChange,
    onPresetDelete,
    onPresetSave,
    onPresetUpdate,
    selectedPreset,
    presets,
    getPresetNameToDelete,
    setPresetIdToDelete,
  } = useFilterPresets({
    getUrl: attributeListUrl,
    params,
    storageUtils,
    reset: clearRowSelection,
  });
  const [attributeBulkDelete, attributeBulkDeleteOpts] = useAttributeBulkDeleteMutation({
    onCompleted: data => {
      if (data.attributeBulkDelete?.errors.length === 0) {
        closeModal();
        notify({
          status: "success",
          text: intl.formatMessage({
            id: "z3GGbZ",
            defaultMessage: "Attributes successfully deleted",
            description: "deleted multiple attributes",
          }),
        });
        clearRowSelection();
        refetch();
      }
    },
  });
  const [openModal, closeModal] = createDialogActionHandlers<
    AttributeListUrlDialog,
    AttributeListUrlQueryParams
  >(navigate, attributeListUrl, params);
  const [changeFilters, resetFilters, handleSearchChange] = createFilterHandlers({
    cleanupFn: clearRowSelection,
    createUrl: attributeListUrl,
    getFilterQueryParam,
    navigate,
    params,
    keepActiveTab: true,
  });
  const paginationValues = usePaginator({
    pageInfo: data?.attributes?.pageInfo,
    paginationState,
    queryString: params,
  });
  const handleSort = createSortHandler(navigate, attributeListUrl, params);
  const attributes = mapEdgesToItems(data?.attributes);
  const handleSelectAttributesIds = useCallback(
    (rows: number[], clearSelection: () => void) => {
      if (!attributes) {
        return;
      }

      const rowsIds = rows.map(row => attributes[row]?.id);
      const haveSaveValues = isEqual(rowsIds, selectedRowIds);

      if (!haveSaveValues) {
        setSelectedRowIds(rowsIds);
      }

      setClearDatagridRowSelectionCallback(clearSelection);
    },
    [attributes, selectedRowIds, setClearDatagridRowSelectionCallback, setSelectedRowIds],
  );

  return (
    <PaginatorContext.Provider value={paginationValues}>
      <AttributeListPage
        settings={settings}
        onUpdateListSettings={updateListSettings}
        onFilterPresetsAll={resetFilters}
        onFilterPresetDelete={(id: number) => {
          setPresetIdToDelete(id);
          openModal("delete-search");
        }}
        onFilterPresetPresetSave={() => openModal("save-search")}
        onFilterPresetChange={onPresetChange}
        onFilterPresetUpdate={onPresetUpdate}
        hasPresetsChanged={hasPresetsChanged}
        onAttributesDelete={() => openModal("remove")}
        selectedFilterPreset={selectedPreset}
        selectedAttributesIds={selectedRowIds}
        filterPresets={presets.map(tab => tab.name)}
        attributes={attributes ?? []}
        disabled={loading || attributeBulkDeleteOpts.loading}
        filterOpts={getFilterOpts(params)}
        initialSearch={params.query || ""}
        onFilterChange={changeFilters}
        onSearchChange={handleSearchChange}
        onSort={handleSort}
        sort={getSortParams(params)}
        onSelectAttributesIds={handleSelectAttributesIds}
      />

      <AttributeBulkDeleteDialog
        confirmButtonState={attributeBulkDeleteOpts.status}
        open={params.action === "remove" && selectedRowIds.length > 0}
        onConfirm={async () => {
          await attributeBulkDelete({ variables: { ids: selectedRowIds } });
          clearRowSelection();
        }}
        onClose={closeModal}
        quantity={selectedRowIds.length}
      />

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

AttributeList.displayName = "AttributeList";

export default AttributeList;
