import { DeleteFilterTabDialog } from "@dashboard/components/DeleteFilterTabDialog/DeleteFilterTabDialog";
import { SaveFilterTabDialog } from "@dashboard/components/SaveFilterTabDialog/SaveFilterTabDialog";
import { CreateCustomerTypeDialog } from "@dashboard/customerTypes/components/CreateCustomerTypeDialog/CreateCustomerTypeDialog";
import { CustomerTypeListPage } from "@dashboard/customerTypes/components/CustomerTypeListPage/CustomerTypeListPage";
import { useCreateCustomerType } from "@dashboard/customerTypes/hooks/useCreateCustomerType";
import {
  customerTypeListUrl,
  type CustomerTypeListUrlDialog,
  type CustomerTypeListUrlQueryParams,
} from "@dashboard/customerTypes/urls";
import { useCustomerTypeListQuery } from "@dashboard/graphql";
import { useFilterPresets } from "@dashboard/hooks/useFilterPresets/useFilterPresets";
import useListSettings from "@dashboard/hooks/useListSettings";
import useNavigator from "@dashboard/hooks/useNavigator";
import { usePaginationReset } from "@dashboard/hooks/usePaginationReset";
import usePaginator, {
  createPaginationState,
  PaginatorContext,
} from "@dashboard/hooks/usePaginator";
import { ListViews } from "@dashboard/types";
import createDialogActionHandlers from "@dashboard/utils/handlers/dialogActionHandlers";
import createFilterHandlers from "@dashboard/utils/handlers/filterHandlers";
import createSortHandler from "@dashboard/utils/handlers/sortHandler";
import { mapEdgesToItems } from "@dashboard/utils/maps";
import { getSortParams } from "@dashboard/utils/sort";
import { useMemo } from "react";

import { getFilterSearch, storageUtils } from "./filters";
import { getSortQueryVariables } from "./sort";

interface CustomerTypeListProps {
  params: CustomerTypeListUrlQueryParams;
}

const CustomerTypeList = ({ params }: CustomerTypeListProps) => {
  const navigate = useNavigator();
  const { settings } = useListSettings(ListViews.CUSTOMER_TYPE_LIST);

  usePaginationReset(customerTypeListUrl, params, settings.rowNumber);

  const paginationState = createPaginationState(settings.rowNumber, params);
  const queryVariables = useMemo(
    () => ({
      ...paginationState,
      search: getFilterSearch(params),
      sort: getSortQueryVariables(params),
    }),
    [params, settings.rowNumber],
  );
  const { data, loading } = useCustomerTypeListQuery({
    displayLoader: true,
    variables: queryVariables,
  });
  const [openModal, closeModal] = createDialogActionHandlers<
    CustomerTypeListUrlDialog,
    CustomerTypeListUrlQueryParams
  >(navigate, customerTypeListUrl, params);
  const createCustomerTypeDialog = useCreateCustomerType({ onClose: closeModal });
  const paginationValues = usePaginator({
    pageInfo: data?.customerTypes?.pageInfo,
    paginationState,
    queryString: params,
  });
  const [, resetFilters, handleSearchChange] = createFilterHandlers({
    createUrl: customerTypeListUrl,
    getFilterQueryParam: async () => undefined,
    navigate,
    params,
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
    getUrl: customerTypeListUrl,
    storageUtils,
  });
  const handleSort = createSortHandler(navigate, customerTypeListUrl, params);
  const customerTypesData = mapEdgesToItems(data?.customerTypes) ?? [];

  return (
    <PaginatorContext.Provider value={paginationValues}>
      <CustomerTypeListPage
        currentTab={selectedPreset}
        initialSearch={params.query || ""}
        onSearchChange={handleSearchChange}
        onAll={() => navigate(customerTypeListUrl())}
        onTabChange={onPresetChange}
        onTabDelete={(id: number) => {
          setPresetIdToDelete(id);
          openModal("delete-search");
        }}
        onTabSave={() => openModal("save-search")}
        onTabUpdate={onPresetUpdate}
        tabs={presets.map(tab => tab.name)}
        hasPresetsChanged={hasPresetsChanged}
        disabled={loading}
        customerTypes={customerTypesData}
        onSort={handleSort}
        sort={getSortParams(params)}
        onCreateCustomerType={() => openModal("create")}
      />
      <CreateCustomerTypeDialog
        open={params.action === "create"}
        onClose={closeModal}
        {...createCustomerTypeDialog}
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

CustomerTypeList.displayName = "CustomerTypeList";
export default CustomerTypeList;
