import { useConditionalFilterContext } from "@dashboard/components/ConditionalFilter";
import { createStaffMembersQueryVariables } from "@dashboard/components/ConditionalFilter/queryVariables";
import { DeleteFilterTabDialog } from "@dashboard/components/DeleteFilterTabDialog";
import { SaveFilterTabDialog } from "@dashboard/components/SaveFilterTabDialog/SaveFilterTabDialog";
import { useShopLimitsQuery } from "@dashboard/components/Shop/queries";
import { useStaffListQuery } from "@dashboard/graphql";
import { useFilterPresets } from "@dashboard/hooks/useFilterPresets";
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
import { useEffect, useMemo } from "react";

import { StaffAddMemberDialog } from "../../components/StaffAddMemberDialog/StaffAddMemberDialog";
import StaffListPage from "../../components/StaffListPage";
import { useStaffInvite } from "../../hooks/useStaffInvite";
import {
  staffListUrl,
  type StaffListUrlDialog,
  type StaffListUrlQueryParams,
  staffMemberDetailsUrl,
} from "../../urls";
import {
  getStaffListColumns,
  shouldMigrateStaffListColumns,
  staffListColumnsWithCustomer,
} from "./columns";
import { getFilterOpts, getFilterQueryParam, storageUtils } from "./filters";
import { getSortQueryVariables } from "./sort";

interface StaffListProps {
  params: StaffListUrlQueryParams;
}

const StaffList = ({ params }: StaffListProps) => {
  const navigate = useNavigator();
  const { updateListSettings, settings } = useListSettings(ListViews.STAFF_MEMBERS_LIST);
  const { valueProvider } = useConditionalFilterContext();
  const filters = createStaffMembersQueryVariables(valueProvider.value);
  const effectiveColumns = getStaffListColumns(settings.columns);
  const staffListSettings = useMemo(
    () => ({
      ...settings,
      columns: effectiveColumns,
    }),
    [effectiveColumns, settings],
  );

  usePaginationReset(staffListUrl, params, settings.rowNumber);
  useEffect(() => {
    if (shouldMigrateStaffListColumns(settings.columns)) {
      updateListSettings("columns", staffListColumnsWithCustomer);
    }
  }, [settings.columns, updateListSettings]);

  const paginationState = createPaginationState(settings.rowNumber, params);

  const newQueryVariables = useMemo(
    () => ({
      ...paginationState,
      filter: {
        ...filters,
        search: params.query,
      },
      includeCustomerData: effectiveColumns?.includes("customer") ?? false,
      sort: getSortQueryVariables(params),
    }),
    [effectiveColumns, params, settings.rowNumber, valueProvider.value],
  );
  const { data: staffQueryData, loading } = useStaffListQuery({
    displayLoader: true,
    variables: newQueryVariables,
  });
  const limitOpts = useShopLimitsQuery({
    variables: {
      staffUsers: true,
    },
  });
  const {
    addStaffMemberData,
    availablePermissionGroups,
    fetchMorePermissionGroups,
    handleStaffMemberAdd,
    searchPermissionGroups,
  } = useStaffInvite({
    onSuccess: userId => navigate(staffMemberDetailsUrl(userId)),
  });
  const paginationValues = usePaginator({
    pageInfo: staffQueryData?.staffUsers?.pageInfo,
    paginationState,
    queryString: params,
  });
  const handleSort = createSortHandler(navigate, staffListUrl, params);
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
    getUrl: staffListUrl,
    params,
    storageUtils,
  });
  const [changeFilters, resetFilters, handleSearchChange] = createFilterHandlers({
    createUrl: staffListUrl,
    getFilterQueryParam,
    navigate,
    params,
    keepActiveTab: true,
  });
  const [openModal, closeModal] = createDialogActionHandlers<
    StaffListUrlDialog,
    StaffListUrlQueryParams
  >(navigate, staffListUrl, params);

  return (
    <PaginatorContext.Provider value={paginationValues}>
      <StaffListPage
        filterOpts={getFilterOpts(params)}
        initialSearch={params.query || ""}
        onSearchChange={handleSearchChange}
        onFilterChange={changeFilters}
        onFilterPresetsAll={resetFilters}
        onFilterPresetDelete={id => {
          setPresetIdToDelete(id);
          openModal("delete-search");
        }}
        selectedFilterPreset={selectedPreset}
        onFilterPresetChange={onPresetChange}
        onFilterPresetUpdate={onPresetUpdate}
        hasPresetsChanged={hasPresetsChanged}
        onFilterPresetPresetSave={() => openModal("save-search")}
        filterPresets={presets.map(preset => preset.name)}
        disabled={loading || addStaffMemberData.loading || limitOpts.loading}
        limits={limitOpts.data?.shop?.limits}
        settings={staffListSettings}
        sort={getSortParams(params)}
        staffMembers={mapEdgesToItems(staffQueryData?.staffUsers) ?? []}
        onAdd={() => openModal("add")}
        onUpdateListSettings={updateListSettings}
        onSort={handleSort}
      />

      <StaffAddMemberDialog
        availablePermissionGroups={availablePermissionGroups}
        confirmButtonState={addStaffMemberData.status}
        initialSearch=""
        disabled={addStaffMemberData.loading}
        errors={addStaffMemberData.data?.staffCreate?.errors || []}
        open={params.action === "add"}
        onClose={closeModal}
        onConfirm={handleStaffMemberAdd}
        fetchMorePermissionGroups={fetchMorePermissionGroups}
        onSearchChange={searchPermissionGroups}
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

export default StaffList;
