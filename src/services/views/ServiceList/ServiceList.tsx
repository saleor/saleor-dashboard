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
import { maybe } from "@saleor/misc";
import { ServiceDeleteMutation } from "@saleor/services/mutations";
import { ServiceDelete } from "@saleor/services/types/ServiceDelete";
import { ListViews } from "@saleor/types";
import { getSortParams } from "@saleor/utils/sort";
import createSortHandler from "@saleor/utils/handlers/sortHandler";
import createDialogActionHandlers from "@saleor/utils/handlers/dialogActionHandlers";
import useShop from "@saleor/hooks/useShop";
import createFilterHandlers from "@saleor/utils/handlers/filterHandlers";
import ServiceDeleteDialog from "../../components/ServiceDeleteDialog";
import ServiceListPage from "../../components/ServiceListPage";
import { useServiceListQuery } from "../../queries";
import {
  serviceAddUrl,
  serviceListUrl,
  ServiceListUrlDialog,
  ServiceListUrlQueryParams,
  serviceUrl
} from "../../urls";
import {
  areFiltersApplied,
  deleteFilterTab,
  getActiveFilters,
  getFilterTabs,
  getFilterQueryParam,
  getFilterVariables,
  saveFilterTab,
  getFilterOpts
} from "./filters";
import { getSortQueryVariables } from "./sort";

interface ServiceListProps {
  params: ServiceListUrlQueryParams;
}

export const ServiceList: React.FC<ServiceListProps> = ({ params }) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const paginate = usePaginator();
  const shop = useShop();
  const { updateListSettings, settings } = useListSettings(
    ListViews.STAFF_MEMBERS_LIST
  );
  const intl = useIntl();

  const paginationState = createPaginationState(settings.rowNumber, params);
  const queryVariables = React.useMemo(
    () => ({
      ...paginationState,
      filter: getFilterVariables(params),
      sort: getSortQueryVariables(params)
    }),
    [params]
  );
  const { data, loading, refetch } = useServiceListQuery({
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
    createUrl: serviceListUrl,
    getFilterQueryParam,
    navigate,
    params
  });

  const [openModal, closeModal] = createDialogActionHandlers<
    ServiceListUrlDialog,
    ServiceListUrlQueryParams
  >(navigate, serviceListUrl, params);

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

  const { loadNextPage, loadPreviousPage, pageInfo } = paginate(
    maybe(() => data.serviceAccounts.pageInfo),
    paginationState,
    params
  );

  const handleCreate = () => navigate(serviceAddUrl);

  const onRemove = (data: ServiceDelete) => {
    if (data.serviceAccountDelete.errors.length === 0) {
      notify({
        text: intl.formatMessage(commonMessages.savedChanges)
      });
      closeModal();
      refetch();
    }
  };

  const handleSort = createSortHandler(navigate, serviceListUrl, params);
  const currencySymbol = maybe(() => shop.defaultCurrency, "USD");

  return (
    <ServiceDeleteMutation onCompleted={onRemove}>
      {(deleteService, deleteServiceOpts) => {
        const handleRemoveConfirm = () =>
          deleteService({
            variables: {
              id: params.id
            }
          });

        return (
          <>
            <ServiceListPage
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
              disabled={loading}
              settings={settings}
              pageInfo={pageInfo}
              services={maybe(() =>
                data.serviceAccounts.edges.map(edge => edge.node)
              )}
              sort={getSortParams(params)}
              onAdd={handleCreate}
              onBack={() => navigate(configurationMenuUrl)}
              onNextPage={loadNextPage}
              onPreviousPage={loadPreviousPage}
              onUpdateListSettings={updateListSettings}
              onRowClick={id => () => navigate(serviceUrl(id))}
              onRemove={id =>
                openModal("remove", {
                  id
                })
              }
              onSort={handleSort}
            />
            <ServiceDeleteDialog
              confirmButtonState={deleteServiceOpts.status}
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
};

export default ServiceList;
