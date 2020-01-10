import React from "react";
import urlJoin from "url-join";

import useListSettings from "@saleor/hooks/useListSettings";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import usePaginator, {
  createPaginationState
} from "@saleor/hooks/usePaginator";
import { useIntl } from "react-intl";

import { newPasswordUrl } from "@saleor/auth/urls";
import DeleteFilterTabDialog from "@saleor/components/DeleteFilterTabDialog";
import SaveFilterTabDialog, {
  SaveFilterTabDialogFormData
} from "@saleor/components/SaveFilterTabDialog";
import { APP_MOUNT_URI } from "@saleor/config";
import { configurationMenuUrl } from "@saleor/configuration";
import useShop from "@saleor/hooks/useShop";
import { commonMessages } from "@saleor/intl";
import { maybe } from "@saleor/misc";
import { ListViews } from "@saleor/types";
import { getSortParams } from "@saleor/utils/sort";
import createSortHandler from "@saleor/utils/handlers/sortHandler";
import createDialogActionHandlers from "@saleor/utils/handlers/dialogActionHandlers";
import createFilterHandlers from "@saleor/utils/handlers/filterHandlers";
import StaffAddMemberDialog, {
  FormData as AddStaffMemberForm
} from "../../components/StaffAddMemberDialog";
import StaffListPage from "../../components/StaffListPage";
import { TypedStaffMemberAddMutation } from "../../mutations";
import { useStaffListQuery } from "../../queries";
import { StaffMemberAdd } from "../../types/StaffMemberAdd";
import {
  staffListUrl,
  StaffListUrlDialog,
  StaffListUrlQueryParams,
  staffMemberDetailsUrl
} from "../../urls";
import {
  areFiltersApplied,
  deleteFilterTab,
  getActiveFilters,
  getFilterTabs,
  getFilterVariables,
  saveFilterTab,
  getFilterQueryParam,
  getFilterOpts
} from "./filters";
import { getSortQueryVariables } from "./sort";

interface StaffListProps {
  params: StaffListUrlQueryParams;
}

export const StaffList: React.FC<StaffListProps> = ({ params }) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const paginate = usePaginator();
  const { updateListSettings, settings } = useListSettings(
    ListViews.STAFF_MEMBERS_LIST
  );
  const intl = useIntl();
  const shop = useShop();

  const paginationState = createPaginationState(settings.rowNumber, params);
  const currencySymbol = maybe(() => shop.defaultCurrency, "USD");
  const queryVariables = React.useMemo(
    () => ({
      ...paginationState,
      filter: getFilterVariables(params),
      sort: getSortQueryVariables(params)
    }),
    [params]
  );
  const { data, loading } = useStaffListQuery({
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
    createUrl: staffListUrl,
    getFilterQueryParam,
    navigate,
    params
  });

  const [openModal, closeModal] = createDialogActionHandlers<
    StaffListUrlDialog,
    StaffListUrlQueryParams
  >(navigate, staffListUrl, params);

  const handleTabChange = (tab: number) => {
    navigate(
      staffListUrl({
        activeTab: tab.toString(),
        ...getFilterTabs()[tab - 1].data
      })
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

  const handleStaffMemberAddSuccess = (data: StaffMemberAdd) => {
    if (data.staffCreate.errors.length === 0) {
      notify({
        text: intl.formatMessage(commonMessages.savedChanges)
      });
      navigate(staffMemberDetailsUrl(data.staffCreate.user.id));
    }
  };

  return (
    <TypedStaffMemberAddMutation onCompleted={handleStaffMemberAddSuccess}>
      {(addStaffMember, addStaffMemberData) => {
        const handleStaffMemberAdd = (variables: AddStaffMemberForm) =>
          addStaffMember({
            variables: {
              input: {
                email: variables.email,
                firstName: variables.firstName,
                lastName: variables.lastName,
                permissions: variables.fullAccess
                  ? maybe(() => shop.permissions.map(perm => perm.code))
                  : undefined,
                redirectUrl: urlJoin(
                  window.location.origin,
                  APP_MOUNT_URI === "/" ? "" : APP_MOUNT_URI,
                  newPasswordUrl().replace(/\?/, "")
                )
              }
            }
          });

        const { loadNextPage, loadPreviousPage, pageInfo } = paginate(
          maybe(() => data.staffUsers.pageInfo),
          paginationState,
          params
        );

        const handleSort = createSortHandler(navigate, staffListUrl, params);

        return (
          <>
            <StaffListPage
              currencySymbol={currencySymbol}
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
              disabled={loading || addStaffMemberData.loading}
              settings={settings}
              pageInfo={pageInfo}
              sort={getSortParams(params)}
              staffMembers={maybe(() =>
                data.staffUsers.edges.map(edge => edge.node)
              )}
              onAdd={() => openModal("add")}
              onBack={() => navigate(configurationMenuUrl)}
              onNextPage={loadNextPage}
              onPreviousPage={loadPreviousPage}
              onUpdateListSettings={updateListSettings}
              onRowClick={id => () => navigate(staffMemberDetailsUrl(id))}
              onSort={handleSort}
            />
            <StaffAddMemberDialog
              confirmButtonState={addStaffMemberData.status}
              errors={maybe(
                () => addStaffMemberData.data.staffCreate.errors,
                []
              )}
              open={params.action === "add"}
              onClose={closeModal}
              onConfirm={handleStaffMemberAdd}
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
          </>
        );
      }}
    </TypedStaffMemberAddMutation>
  );
};

export default StaffList;
