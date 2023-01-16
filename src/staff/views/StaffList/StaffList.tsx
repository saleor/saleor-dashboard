import { newPasswordUrl } from "@dashboard/auth/urls";
import DeleteFilterTabDialog from "@dashboard/components/DeleteFilterTabDialog";
import SaveFilterTabDialog, {
  SaveFilterTabDialogFormData,
} from "@dashboard/components/SaveFilterTabDialog";
import { useShopLimitsQuery } from "@dashboard/components/Shop/queries";
import { DEFAULT_INITIAL_SEARCH_DATA } from "@dashboard/config";
import {
  useStaffListQuery,
  useStaffMemberAddMutation,
} from "@dashboard/graphql";
import useListSettings from "@dashboard/hooks/useListSettings";
import useNavigator from "@dashboard/hooks/useNavigator";
import useNotifier from "@dashboard/hooks/useNotifier";
import { usePaginationReset } from "@dashboard/hooks/usePaginationReset";
import usePaginator, {
  createPaginationState,
  PaginatorContext,
} from "@dashboard/hooks/usePaginator";
import { commonMessages } from "@dashboard/intl";
import { getStringOrPlaceholder } from "@dashboard/misc";
import usePermissionGroupSearch from "@dashboard/searches/usePermissionGroupSearch";
import { ListViews } from "@dashboard/types";
import createDialogActionHandlers from "@dashboard/utils/handlers/dialogActionHandlers";
import createFilterHandlers from "@dashboard/utils/handlers/filterHandlers";
import createSortHandler from "@dashboard/utils/handlers/sortHandler";
import { mapEdgesToItems } from "@dashboard/utils/maps";
import { getSortParams } from "@dashboard/utils/sort";
import { getAppMountUriForRedirect } from "@dashboard/utils/urls";
import React from "react";
import { useIntl } from "react-intl";
import urlJoin from "url-join";

import StaffAddMemberDialog, {
  AddMemberFormData,
} from "../../components/StaffAddMemberDialog";
import StaffListPage from "../../components/StaffListPage";
import {
  staffListUrl,
  StaffListUrlDialog,
  StaffListUrlQueryParams,
  staffMemberDetailsUrl,
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
import { getSortQueryVariables } from "./sort";

interface StaffListProps {
  params: StaffListUrlQueryParams;
}

export const StaffList: React.FC<StaffListProps> = ({ params }) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const { updateListSettings, settings } = useListSettings(
    ListViews.STAFF_MEMBERS_LIST,
  );
  const intl = useIntl();

  usePaginationReset(staffListUrl, params, settings.rowNumber);

  const paginationState = createPaginationState(settings.rowNumber, params);
  const queryVariables = React.useMemo(
    () => ({
      ...paginationState,
      filter: getFilterVariables(params),
      sort: getSortQueryVariables(params),
    }),
    [params, settings.rowNumber],
  );
  const { data: staffQueryData, loading } = useStaffListQuery({
    displayLoader: true,
    variables: queryVariables,
  });
  const limitOpts = useShopLimitsQuery({
    variables: {
      staffUsers: true,
    },
  });

  const [addStaffMember, addStaffMemberData] = useStaffMemberAddMutation({
    onCompleted: data => {
      if (data.staffCreate.errors.length === 0) {
        notify({
          status: "success",
          text: intl.formatMessage(commonMessages.savedChanges),
        });
        navigate(staffMemberDetailsUrl(data.staffCreate.user.id));
      }
    },
  });

  const paginationValues = usePaginator({
    pageInfo: staffQueryData?.staffUsers.pageInfo,
    paginationState,
    queryString: params,
  });

  const handleSort = createSortHandler(navigate, staffListUrl, params);

  const tabs = getFilterTabs();

  const currentTab = getFiltersCurrentTab(params, tabs);

  const [
    changeFilters,
    resetFilters,
    handleSearchChange,
  ] = createFilterHandlers({
    createUrl: staffListUrl,
    getFilterQueryParam,
    navigate,
    params,
  });

  const [openModal, closeModal] = createDialogActionHandlers<
    StaffListUrlDialog,
    StaffListUrlQueryParams
  >(navigate, staffListUrl, params);

  const handleTabChange = (tab: number) => {
    navigate(
      staffListUrl({
        activeTab: tab.toString(),
        ...getFilterTabs()[tab - 1].data,
      }),
    );
  };

  const handleTabDelete = () => {
    deleteFilterTab(currentTab);
    navigate(staffListUrl());
  };

  const handleTabSave = (data: SaveFilterTabDialogFormData) => {
    saveFilterTab(data.name, getActiveFilters(params));
    handleTabChange(tabs.length + 1);
  };

  const {
    loadMore: loadMorePermissionGroups,
    search: searchPermissionGroups,
    result: searchPermissionGroupsOpts,
  } = usePermissionGroupSearch({
    variables: DEFAULT_INITIAL_SEARCH_DATA,
  });

  const handleStaffMemberAdd = (variables: AddMemberFormData) =>
    addStaffMember({
      variables: {
        input: {
          addGroups: variables.permissionGroups,
          email: variables.email,
          firstName: variables.firstName,
          lastName: variables.lastName,
          redirectUrl: urlJoin(
            window.location.origin,
            getAppMountUriForRedirect(),
            newPasswordUrl().replace(/\?/, ""),
          ),
        },
      },
    });

  return (
    <PaginatorContext.Provider value={paginationValues}>
      <StaffListPage
        currentTab={currentTab}
        filterOpts={getFilterOpts(params)}
        initialSearch={params.query || ""}
        onSearchChange={handleSearchChange}
        onFilterChange={changeFilters}
        onAll={resetFilters}
        onTabChange={handleTabChange}
        onTabDelete={() => openModal("delete-search")}
        onTabSave={() => openModal("save-search")}
        tabs={tabs.map(tab => tab.name)}
        disabled={loading || addStaffMemberData.loading || limitOpts.loading}
        limits={limitOpts.data?.shop.limits}
        settings={settings}
        sort={getSortParams(params)}
        staffMembers={mapEdgesToItems(staffQueryData?.staffUsers)}
        onAdd={() => openModal("add")}
        onUpdateListSettings={updateListSettings}
        onSort={handleSort}
      />
      <StaffAddMemberDialog
        availablePermissionGroups={mapEdgesToItems(
          searchPermissionGroupsOpts?.data?.search,
        )}
        confirmButtonState={addStaffMemberData.status}
        initialSearch=""
        disabled={loading}
        errors={addStaffMemberData.data?.staffCreate.errors || []}
        open={params.action === "add"}
        onClose={closeModal}
        onConfirm={handleStaffMemberAdd}
        fetchMorePermissionGroups={{
          hasMore: searchPermissionGroupsOpts.data?.search.pageInfo.hasNextPage,
          loading: searchPermissionGroupsOpts.loading,
          onFetchMore: loadMorePermissionGroups,
        }}
        onSearchChange={searchPermissionGroups}
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
        tabName={getStringOrPlaceholder(tabs[currentTab - 1]?.name)}
      />
    </PaginatorContext.Provider>
  );
};

export default StaffList;
