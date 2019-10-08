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
import { getMutationState, maybe } from "@saleor/misc";
import { ListViews } from "@saleor/types";
import StaffAddMemberDialog, {
  FormData as AddStaffMemberForm
} from "../../components/StaffAddMemberDialog";
import StaffListPage from "../../components/StaffListPage";
import { TypedStaffMemberAddMutation } from "../../mutations";
import { TypedStaffListQuery } from "../../queries";
import { StaffMemberAdd } from "../../types/StaffMemberAdd";
import {
  staffListUrl,
  StaffListUrlDialog,
  StaffListUrlFilters,
  StaffListUrlQueryParams,
  staffMemberDetailsUrl
} from "../../urls";
import {
  areFiltersApplied,
  deleteFilterTab,
  getActiveFilters,
  getFilterTabs,
  getFilterVariables,
  saveFilterTab
} from "./filter";

interface StaffListProps {
  params: StaffListUrlQueryParams;
}

export const StaffList: React.StatelessComponent<StaffListProps> = ({
  params
}) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const paginate = usePaginator();
  const { updateListSettings, settings } = useListSettings(
    ListViews.STAFF_MEMBERS_LIST
  );
  const intl = useIntl();
  const shop = useShop();

  const tabs = getFilterTabs();

  const currentTab =
    params.activeTab === undefined
      ? areFiltersApplied(params)
        ? tabs.length + 1
        : 0
      : parseInt(params.activeTab, 0);

  const changeFilterField = (filter: StaffListUrlFilters) =>
    navigate(
      staffListUrl({
        ...getActiveFilters(params),
        ...filter,
        activeTab: undefined
      })
    );

  const closeModal = () =>
    navigate(
      staffListUrl({
        ...params,
        action: undefined,
        ids: undefined
      }),
      true
    );

  const openModal = (action: StaffListUrlDialog, ids?: string[]) =>
    navigate(
      staffListUrl({
        ...params,
        action,
        ids
      })
    );

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

  const paginationState = createPaginationState(settings.rowNumber, params);
  const queryVariables = React.useMemo(
    () => ({
      ...paginationState,
      filter: getFilterVariables(params)
    }),
    [params]
  );

  return (
    <TypedStaffListQuery displayLoader variables={queryVariables}>
      {({ data, loading }) => {
        const handleStaffMemberAddSuccess = (data: StaffMemberAdd) => {
          if (data.staffCreate.errors.length === 0) {
            notify({
              text: intl.formatMessage(commonMessages.savedChanges)
            });
            navigate(staffMemberDetailsUrl(data.staffCreate.user.id));
          }
        };

        return (
          <TypedStaffMemberAddMutation
            onCompleted={handleStaffMemberAddSuccess}
          >
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
                      ),
                      sendPasswordEmail: true
                    }
                  }
                });
              const addTransitionState = getMutationState(
                addStaffMemberData.called,
                addStaffMemberData.loading,
                maybe(() => addStaffMemberData.data.staffCreate.errors)
              );

              const { loadNextPage, loadPreviousPage, pageInfo } = paginate(
                maybe(() => data.staffUsers.pageInfo),
                paginationState,
                params
              );

              return (
                <>
                  <StaffListPage
                    currentTab={currentTab}
                    initialSearch={params.query || ""}
                    onSearchChange={query => changeFilterField({ query })}
                    onAll={() => navigate(staffListUrl())}
                    onTabChange={handleTabChange}
                    onTabDelete={() => openModal("delete-search")}
                    onTabSave={() => openModal("save-search")}
                    tabs={tabs.map(tab => tab.name)}
                    disabled={loading || addStaffMemberData.loading}
                    settings={settings}
                    pageInfo={pageInfo}
                    staffMembers={maybe(() =>
                      data.staffUsers.edges.map(edge => edge.node)
                    )}
                    onAdd={() =>
                      navigate(
                        staffListUrl({
                          action: "add"
                        })
                      )
                    }
                    onBack={() => navigate(configurationMenuUrl)}
                    onNextPage={loadNextPage}
                    onPreviousPage={loadPreviousPage}
                    onUpdateListSettings={updateListSettings}
                    onRowClick={id => () => navigate(staffMemberDetailsUrl(id))}
                  />
                  <StaffAddMemberDialog
                    confirmButtonState={addTransitionState}
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
      }}
    </TypedStaffListQuery>
  );
};

export default StaffList;
