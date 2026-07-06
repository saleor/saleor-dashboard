import { useConditionalFilterContext } from "@dashboard/components/ConditionalFilter";
import { createCustomerQueryVariables } from "@dashboard/components/ConditionalFilter/queryVariables";
import { DeleteFilterTabDialog } from "@dashboard/components/DeleteFilterTabDialog";
import { SaveFilterTabDialog } from "@dashboard/components/SaveFilterTabDialog/SaveFilterTabDialog";
import { WindowTitle } from "@dashboard/components/WindowTitle";
import { useBulkRemoveCustomersMutation, useListCustomersQuery } from "@dashboard/graphql";
import { useFilterPresets } from "@dashboard/hooks/useFilterPresets";
import useListSettings from "@dashboard/hooks/useListSettings";
import useNavigator from "@dashboard/hooks/useNavigator";
import { useNotifier } from "@dashboard/hooks/useNotifier";
import { usePaginationReset } from "@dashboard/hooks/usePaginationReset";
import usePaginator, {
  createPaginationState,
  PaginatorContext,
} from "@dashboard/hooks/usePaginator";
import { useRowSelection } from "@dashboard/hooks/useRowSelection";
import { sectionNames } from "@dashboard/intl";
import { ListViews } from "@dashboard/types";
import commonErrorMessages from "@dashboard/utils/errors/common";
import createDialogActionHandlers from "@dashboard/utils/handlers/dialogActionHandlers";
import createFilterHandlers from "@dashboard/utils/handlers/filterHandlers";
import createSortHandler from "@dashboard/utils/handlers/sortHandler";
import { mapEdgesToItems } from "@dashboard/utils/maps";
import { getSortParams } from "@dashboard/utils/sort";
import isEqual from "lodash/isEqual";
import { useCallback, useMemo } from "react";
import { useIntl } from "react-intl";

import { CustomerBulkDeleteDialog } from "../../components/CustomerBulkDeleteDialog/CustomerBulkDeleteDialog";
import CustomerListPage from "../../components/CustomerListPage";
import {
  customerListUrl,
  type CustomerListUrlDialog,
  type CustomerListUrlQueryParams,
} from "../../urls";
import { getFilterOpts, getFilterQueryParam, storageUtils } from "./filters";
import { getSortQueryVariables } from "./sort";

interface CustomerListProps {
  params: CustomerListUrlQueryParams;
}

const CustomerList = ({ params }: CustomerListProps) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const intl = useIntl();
  const { updateListSettings, settings } = useListSettings(ListViews.CUSTOMER_LIST);
  const { valueProvider } = useConditionalFilterContext();
  const filter = createCustomerQueryVariables(valueProvider.value);

  usePaginationReset(customerListUrl, params, settings.rowNumber);

  const {
    clearRowSelection,
    selectedRowIds,
    setClearDatagridRowSelectionCallback,
    setSelectedRowIds,
  } = useRowSelection(params);
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
    reset: clearRowSelection,
    getUrl: customerListUrl,
    storageUtils,
  });
  const paginationState = createPaginationState(settings.rowNumber, params);
  const newQueryVariables = useMemo(
    () => ({
      ...paginationState,
      filter: {
        ...filter,
        search: params.query,
      },
      sort: getSortQueryVariables(params),
    }),
    [params, settings.rowNumber, valueProvider.value],
  );

  const { data, refetch } = useListCustomersQuery({
    displayLoader: true,
    variables: newQueryVariables,
  });
  const customers = mapEdgesToItems(data?.customers);
  const [changeFilters, resetFilters, handleSearchChange] = createFilterHandlers({
    cleanupFn: clearRowSelection,
    createUrl: customerListUrl,
    getFilterQueryParam,
    navigate,
    params,
    keepActiveTab: true,
  });
  const [openModal, closeModal] = createDialogActionHandlers<
    CustomerListUrlDialog,
    CustomerListUrlQueryParams
  >(navigate, customerListUrl, params);
  const paginationValues = usePaginator({
    pageInfo: data?.customers?.pageInfo,
    paginationState,
    queryString: params,
  });
  const [bulkRemoveCustomers, bulkRemoveCustomersOpts] = useBulkRemoveCustomersMutation({
    onCompleted: data => {
      const errors = data.customerBulkDelete?.errors ?? [];

      if (errors.length === 0) {
        notify({
          status: "success",
          text: intl.formatMessage({ id: "xgPXGD", defaultMessage: "Customers deleted" }),
        });
        refetch();
        clearRowSelection();
        closeModal();

        return;
      }

      notify({
        status: "error",
        text: intl.formatMessage(commonErrorMessages.unknownError),
      });
    },
  });
  const handleSort = createSortHandler(navigate, customerListUrl, params);
  const handleSetSelectedCustomerIds = useCallback(
    (rows: number[], clearSelection: () => void) => {
      if (!customers) {
        return;
      }

      const rowsIds = rows.map(row => customers[row]?.id).filter(id => id !== undefined);
      const haveSaveValues = isEqual(rowsIds, selectedRowIds);

      if (!haveSaveValues) {
        setSelectedRowIds(rowsIds);
      }

      setClearDatagridRowSelectionCallback(clearSelection);
    },
    [customers, selectedRowIds, setClearDatagridRowSelectionCallback, setSelectedRowIds],
  );

  return (
    <PaginatorContext.Provider value={paginationValues}>
      <WindowTitle title={intl.formatMessage(sectionNames.customers)} />
      <CustomerListPage
        selectedFilterPreset={selectedPreset}
        filterOpts={getFilterOpts(params)}
        initialSearch={params.query || ""}
        onSearchChange={handleSearchChange}
        onFilterChange={changeFilters}
        onFilterPresetsAll={resetFilters}
        onFilterPresetChange={onPresetChange}
        onFilterPresetDelete={(id: number) => {
          setPresetIdToDelete(id);
          openModal("delete-search");
        }}
        onFilterPresetPresetSave={() => openModal("save-search")}
        onFilterPresetUpdate={onPresetUpdate}
        filterPresets={presets.map(preset => preset.name)}
        customers={customers}
        settings={settings}
        disabled={!data}
        loading={!data}
        onUpdateListSettings={updateListSettings}
        onSort={handleSort}
        selectedCustomerIds={selectedRowIds}
        onSelectCustomerIds={handleSetSelectedCustomerIds}
        sort={getSortParams(params)}
        hasPresetsChanged={hasPresetsChanged}
        onCustomersDelete={() => openModal("remove", { ids: selectedRowIds })}
      />
      <CustomerBulkDeleteDialog
        confirmButtonState={bulkRemoveCustomersOpts.status}
        count={selectedRowIds?.length ?? 0}
        onClose={closeModal}
        onConfirm={() =>
          bulkRemoveCustomers({
            variables: {
              ids: selectedRowIds,
            },
          })
        }
        open={params.action === "remove" && selectedRowIds?.length > 0}
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

export default CustomerList;
