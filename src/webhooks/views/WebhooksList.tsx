import { configurationMenuUrl } from "@saleor/configuration";
import useListSettings from "@saleor/hooks/useListSettings";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import usePaginator, {
  createPaginationState
} from "@saleor/hooks/usePaginator";
import { commonMessages } from "@saleor/intl";
import { getMutationState, maybe } from "@saleor/misc";
import { ListViews } from "@saleor/types";
import WebhookDeleteDialog from "@saleor/webhooks/components/WebhookDeleteDialog";
import { WebhookDelete } from "@saleor/webhooks/types/WebhookDelete";
import React from "react";
import { useIntl } from "react-intl";

import WebhooksListPage from "../components/WebhooksListPage/WebhooksListPage";
import { TypedWebhookDelete } from "../mutations";
import { TypedWebhooksListQuery } from "../queries";
import {
  webhooksAddUrl,
  webhooksListUrl,
  WebhooksListUrlQueryParams,
  webhooksUrl
} from "../urls";

interface WebhooksListProps {
  params: WebhooksListUrlQueryParams;
}

export const WebhooksList: React.StatelessComponent<WebhooksListProps> = ({
  params
}) => {
  const navigate = useNavigator();
  const paginate = usePaginator();
  const notify = useNotifier();
  const intl = useIntl();
  const { updateListSettings, settings } = useListSettings(
    ListViews.WEBHOOK_LIST
  );
  const paginationState = createPaginationState(settings.rowNumber, params);

  const closeModal = () =>
    navigate(
      webhooksListUrl({
        ...params,
        action: undefined,
        id: undefined
      }),
      true
    );

  return (
    <TypedWebhooksListQuery displayLoader variables={paginationState}>
      {({ data, loading, refetch }) => {
        const onWebhookDelete = (data: WebhookDelete) => {
          if (data.webhookDelete.errors.length === 0) {
            notify({
              text: intl.formatMessage(commonMessages.savedChanges)
            });
            navigate(webhooksListUrl());
            refetch();
          }
        };
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
                  webhooksListUrl({
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

              const deleteTransitionState = getMutationState(
                webhookDeleteOpts.called,
                webhookDeleteOpts.loading,
                maybe(() => webhookDeleteOpts.data.webhookDelete.errors)
              );

              return (
                <>
                  <WebhooksListPage
                    disabled={loading}
                    settings={settings}
                    webhooks={maybe(() =>
                      data.webhooks.edges.map(edge => edge.node)
                    )}
                    pageInfo={pageInfo}
                    onAdd={() => navigate(webhooksAddUrl)}
                    onBack={() => navigate(configurationMenuUrl)}
                    onNextPage={loadNextPage}
                    onPreviousPage={loadPreviousPage}
                    onRemove={handleRemove}
                    onUpdateListSettings={updateListSettings}
                    onRowClick={id => () => navigate(webhooksUrl(id))}
                  />
                  <WebhookDeleteDialog
                    confirmButtonState={deleteTransitionState}
                    name={maybe(
                      () =>
                        data.webhooks.edges.find(
                          edge => edge.node.id === params.id
                        ).node.name,
                      "..."
                    )}
                    onClose={closeModal}
                    onConfirm={handleRemoveConfirm}
                    open={params.action === "remove"}
                  />
                </>
              );
            }}
          </TypedWebhookDelete>
        );
      }}
    </TypedWebhooksListQuery>
  );
};

export default WebhooksList;
