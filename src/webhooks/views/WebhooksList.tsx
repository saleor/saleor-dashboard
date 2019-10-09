import { configurationMenuUrl } from "@saleor/configuration";
import useListSettings from "@saleor/hooks/useListSettings";
import useNavigator from "@saleor/hooks/useNavigator";
import usePaginator, {
  createPaginationState
} from "@saleor/hooks/usePaginator";
import { maybe } from "@saleor/misc";
import { ListViews } from "@saleor/types";
import React from "react";

import WebhooksListPage from "../components/WebhooksListPage/WebhooksListPage";
import { TypedWebhooksListQuery } from "../queries";
import { WebhooksListUrlQueryParams, webhooksUrl } from "../urls";

interface WebhooksListProps {
  params: WebhooksListUrlQueryParams;
}

export const WebhooksList: React.StatelessComponent<WebhooksListProps> = ({
  params
}) => {
  const navigate = useNavigator();
  const paginate = usePaginator();
  const { updateListSettings, settings } = useListSettings(
    ListViews.WEBHOOK_LIST
  );
  const paginationState = createPaginationState(settings.rowNumber, params);

  return (
    <TypedWebhooksListQuery displayLoader variables={paginationState}>
      {({ data, loading }) => {
        const { loadNextPage, loadPreviousPage, pageInfo } = paginate(
          maybe(() => data.webhooks.pageInfo),
          paginationState,
          params
        );
        return (
          <>
            <WebhooksListPage
              disabled={loading}
              settings={settings}
              webhooks={maybe(() => data.webhooks.edges.map(edge => edge.node))}
              pageInfo={pageInfo}
              onAdd={() => navigate(configurationMenuUrl)}
              onBack={() => navigate(configurationMenuUrl)}
              onNextPage={loadNextPage}
              onPreviousPage={loadPreviousPage}
              onUpdateListSettings={updateListSettings}
              onRowClick={id => () => navigate(webhooksUrl(id))}
            />
          </>
        );
      }}
    </TypedWebhooksListQuery>
  );
};

export default WebhooksList;
