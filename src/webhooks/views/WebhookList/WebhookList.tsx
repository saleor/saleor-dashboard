import DeleteFilterTabDialog from "@saleor/components/DeleteFilterTabDialog";
import SaveFilterTabDialog, {
  SaveFilterTabDialogFormData
} from "@saleor/components/SaveFilterTabDialog";
import { configurationMenuUrl } from "@saleor/configuration";
import useListSettings from "@saleor/hooks/useListSettings";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import usePaginator, {
  createPaginationState
} from "@saleor/hooks/usePaginator";
import { commonMessages } from "@saleor/intl";
import { maybe } from "@saleor/misc";
import { ListViews } from "@saleor/types";
import WebhookDeleteDialog from "@saleor/webhooks/components/WebhookDeleteDialog";
import { WebhookDelete } from "@saleor/webhooks/types/WebhookDelete";
import React from "react";
import { useIntl } from "react-intl";

import { getSortParams } from "@saleor/utils/sort";
import createSortHandler from "@saleor/utils/handlers/sortHandler";
import useShop from "@saleor/hooks/useShop";
import createFilterHandlers from "@saleor/utils/handlers/filterHandlers";
import createDialogActionHandlers from "@saleor/utils/handlers/dialogActionHandlers";
import WebhooksListPage from "../../components/WebhooksListPage/WebhooksListPage";
import { TypedWebhookDelete } from "../../mutations";
import { useWebhooksListQuery } from "../../queries";
import {
  WebhookListUrlDialog,
  webhookAddUrl,
  webhookListUrl,
  WebhookListUrlQueryParams,
  webhookUrl
} from "../../urls";
import { getSortQueryVariables } from "./sort";
import {
  areFiltersApplied,
  deleteFilterTab,
  getActiveFilters,
  getFilterTabs,
  getFilterVariables,
  getFilterQueryParam,
  saveFilterTab,
  getFilterOpts
} from "./filters";

interface WebhooksListProps {
  params: WebhookListUrlQueryParams;
}

export const WebhooksList: React.FC<WebhooksListProps> = ({ params }) => {
  const navigate = useNavigator();
  const paginate = usePaginator();
  const notify = useNotifier();
  const intl = useIntl();
  const shop = useShop();
  const { updateListSettings, settings } = useListSettings(
    ListViews.WEBHOOK_LIST
  );

  const paginationState = createPaginationState(settings.rowNumber, params);
  const queryVariables = React.useMemo(
    () => ({
      ...paginationState,
      filter: getFilterVariables(params),
      sort: getSortQueryVariables(params)
    }),
    [params]
  );
  const { data, loading, refetch } = useWebhooksListQuery({
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
    createUrl: webhookListUrl,
    getFilterQueryParam,
    navigate,
    params
  });

  const [openModal, closeModal] = createDialogActionHandlers<
    WebhookListUrlDialog,
    WebhookListUrlQueryParams
  >(navigate, webhookListUrl, params);

  const handleTabChange = (tab: number) => {
    navigate(
      webhookListUrl({
        activeTab: tab.toString(),
        ...getFilterTabs()[tab - 1].data
      })
    );
  };

  const handleTabDelete = () => {
    deleteFilterTab(currentTab);
    navigate(webhookListUrl());
  };

  const handleTabSave = (data: SaveFilterTabDialogFormData) => {
    saveFilterTab(data.name, getActiveFilters(params));
    handleTabChange(tabs.length + 1);
  };

  const onWebhookDelete = (data: WebhookDelete) => {
    if (data.webhookDelete.errors.length === 0) {
      notify({
        text: intl.formatMessage(commonMessages.savedChanges)
      });
      navigate(webhookListUrl());
      refetch();
    }
  };

  const handleSort = createSortHandler(navigate, webhookListUrl, params);
  const currencySymbol = maybe(() => shop.defaultCurrency, "USD");

  return (
    <TypedWebhookDelete onCompleted={onWebhookDelete}>
      {(webhookDelete, webhookDeleteOpts) => {
        const { loadNextPage, loadPreviousPage, pageInfo } = paginate(
          maybe(() => data.webhooks.pageInfo),
          paginationState,
          params
        );
        const handleRemove = (id: string) => {
          navigate(
            webhookListUrl({
              ...params,
              action: "remove",
              id
            })
          );
        };
        const handleRemoveConfirm = () => {
          webhookDelete({
            variables: {
              id: params.id
            }
          });
        };

        return (
          <>
            <WebhooksListPage
              currencySymbol={currencySymbol}
              currentTab={currentTab}
              filterOpts={getFilterOpts(params)}
              initialSearch={params.query || ""}
              onFilterChange={changeFilters}
              onSearchChange={handleSearchChange}
              onAll={resetFilters}
              onTabChange={handleTabChange}
              onTabDelete={() => openModal("delete-search")}
              onTabSave={() => openModal("save-search")}
              tabs={tabs.map(tab => tab.name)}
              disabled={loading}
              settings={settings}
              sort={getSortParams(params)}
              webhooks={maybe(() => data.webhooks.edges.map(edge => edge.node))}
              pageInfo={pageInfo}
              onAdd={() => navigate(webhookAddUrl)}
              onBack={() => navigate(configurationMenuUrl)}
              onNextPage={loadNextPage}
              onPreviousPage={loadPreviousPage}
              onRemove={handleRemove}
              onSort={handleSort}
              onUpdateListSettings={updateListSettings}
              onRowClick={id => () => navigate(webhookUrl(id))}
            />
            <WebhookDeleteDialog
              confirmButtonState={webhookDeleteOpts.status}
              name={maybe(
                () =>
                  data.webhooks.edges.find(edge => edge.node.id === params.id)
                    .node.name,
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
    </TypedWebhookDelete>
  );
};

export default WebhooksList;
