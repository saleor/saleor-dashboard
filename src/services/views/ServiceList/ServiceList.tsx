import React from "react";

import useListSettings from "@saleor/hooks/useListSettings";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import usePaginator, {
  createPaginationState
} from "@saleor/hooks/usePaginator";
import { useIntl } from "react-intl";

import DeleteFilterTabDialog from "@saleor/components/DeleteFilterTabDialog";
import SaveFilterTabDialog, {
  SaveFilterTabDialogFormData
} from "@saleor/components/SaveFilterTabDialog";
import { configurationMenuUrl } from "@saleor/configuration";
import { commonMessages } from "@saleor/intl";
import { getMutationState, maybe } from "@saleor/misc";
import { ServiceDeleteMutation } from "@saleor/services/mutations";
import { ServiceDelete } from "@saleor/services/types/ServiceDelete";
import { ListViews } from "@saleor/types";
import ServiceDeleteDialog from "../../components/ServiceDeleteDialog";
import ServiceListPage from "../../components/ServiceListPage";
import { ServiceListQuery } from "../../queries";
import {
  serviceAddUrl,
  serviceListUrl,
  ServiceListUrlDialog,
  ServiceListUrlFilters,
  ServiceListUrlQueryParams,
  serviceUrl
} from "../../urls";
import {
  areFiltersApplied,
  deleteFilterTab,
  getActiveFilters,
  getFilterTabs,
  getFilterVariables,
  saveFilterTab
} from "./filter";

interface ServiceListProps {
  params: ServiceListUrlQueryParams;
}

export const ServiceList: React.StatelessComponent<ServiceListProps> = ({
  params
}) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const paginate = usePaginator();
  const { updateListSettings, settings } = useListSettings(
    ListViews.STAFF_MEMBERS_LIST
  );
  const intl = useIntl();

  const tabs = getFilterTabs();

  const currentTab =
    params.activeTab === undefined
      ? areFiltersApplied(params)
        ? tabs.length + 1
        : 0
      : parseInt(params.activeTab, 0);

  const changeFilterField = (filter: ServiceListUrlFilters) =>
    navigate(
      serviceListUrl({
        ...getActiveFilters(params),
        ...filter,
        activeTab: undefined
      })
    );

  const closeModal = () =>
    navigate(
      serviceListUrl({
        ...params,
        action: undefined,
        id: undefined
      }),
      true
    );

  const openModal = (action: ServiceListUrlDialog, id?: string) =>
    navigate(
      serviceListUrl({
        ...params,
        action,
        id
      })
    );

  const handleTabChange = (tab: number) => {
    navigate(
      serviceListUrl({
        activeTab: tab.toString(),
        ...getFilterTabs()[tab - 1].data
      })
    );
  };

  const handleTabDelete = () => {
    deleteFilterTab(currentTab);
    navigate(serviceListUrl());
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
    <ServiceListQuery displayLoader variables={queryVariables}>
      {({ data, loading, refetch }) => {
        const { loadNextPage, loadPreviousPage, pageInfo } = paginate(
          maybe(() => data.serviceAccounts.pageInfo),
          paginationState,
          params
        );

        const handleCreate = () => navigate(serviceAddUrl);
        const handleRemove = (id: string) =>
          navigate(
            serviceListUrl({
              ...params,
              action: "remove",
              id
            })
          );
        const onRemove = (data: ServiceDelete) => {
          if (data.serviceAccountDelete.errors.length === 0) {
            notify({
              text: intl.formatMessage(commonMessages.savedChanges)
            });
            closeModal();
            refetch();
          }
        };

        return (
          <ServiceDeleteMutation onCompleted={onRemove}>
            {(deleteService, deleteServiceOpts) => {
              const handleRemoveConfirm = () =>
                deleteService({
                  variables: {
                    id: params.id
                  }
                });

              const removeTransitionState = getMutationState(
                deleteServiceOpts.called,
                deleteServiceOpts.loading,
                maybe(() => deleteServiceOpts.data.serviceAccountDelete.errors)
              );

              return (
                <>
                  <ServiceListPage
                    currentTab={currentTab}
                    initialSearch={params.query || ""}
                    onSearchChange={query => changeFilterField({ query })}
                    onAll={() => navigate(serviceListUrl())}
                    onTabChange={handleTabChange}
                    onTabDelete={() => openModal("delete-search")}
                    onTabSave={() => openModal("save-search")}
                    tabs={tabs.map(tab => tab.name)}
                    disabled={loading}
                    settings={settings}
                    pageInfo={pageInfo}
                    services={maybe(() =>
                      data.serviceAccounts.edges.map(edge => edge.node)
                    )}
                    onAdd={handleCreate}
                    onBack={() => navigate(configurationMenuUrl)}
                    onNextPage={loadNextPage}
                    onPreviousPage={loadPreviousPage}
                    onUpdateListSettings={updateListSettings}
                    onRowClick={id => () => navigate(serviceUrl(id))}
                    onRemove={handleRemove}
                  />
                  <ServiceDeleteDialog
                    confirmButtonState={removeTransitionState}
                    name={maybe(
                      () =>
                        data.serviceAccounts.edges.find(
                          edge => edge.node.id === params.id
                        ).node.name,
                      "..."
                    )}
                    onClose={closeModal}
                    onConfirm={handleRemoveConfirm}
                    open={params.action === "remove"}
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
          </ServiceDeleteMutation>
        );
      }}
    </ServiceListQuery>
  );
};

export default ServiceList;
