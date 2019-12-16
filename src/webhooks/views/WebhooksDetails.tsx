import React from "react";
import { useIntl } from "react-intl";

import { WindowTitle } from "@saleor/components/WindowTitle";
import { DEFAULT_INITIAL_SEARCH_DATA } from "@saleor/config";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import { commonMessages } from "@saleor/intl";
import useServiceAccountSearch from "@saleor/searches/useServiceAccountSearch";
import { WebhookEventTypeEnum } from "@saleor/types/globalTypes";
import WebhookDeleteDialog from "@saleor/webhooks/components/WebhookDeleteDialog";
import { WebhookDelete } from "@saleor/webhooks/types/WebhookDelete";
import { WebhookUpdate } from "@saleor/webhooks/types/WebhookUpdate";
import { maybe } from "../../misc";
import WebhooksDetailsPage from "../components/WebhooksDetailsPage";
import { TypedWebhookDelete, TypedWebhookUpdate } from "../mutations";
import { TypedWebhooksDetailsQuery } from "../queries";
import {
  webhooksListUrl,
  WebhooksListUrlQueryParams,
  webhooksUrl,
  WebhookUrlDialog
} from "../urls";

export interface WebhooksDetailsProps {
  id: string;
  params: WebhooksListUrlQueryParams;
}

export const WebhooksDetails: React.FC<WebhooksDetailsProps> = ({
  id,
  params
}) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const intl = useIntl();
  const {
    search: searchServiceAccount,
    result: searchServiceAccountOpt
  } = useServiceAccountSearch({
    variables: DEFAULT_INITIAL_SEARCH_DATA
  });

  const closeModal = () =>
    navigate(
      webhooksUrl(id, {
        ...params,
        action: undefined,
        id: undefined
      }),
      true
    );

  const openModal = (action: WebhookUrlDialog, tokenId?: string) =>
    navigate(
      webhooksUrl(id, {
        ...params,
        action,
        id: tokenId
      })
    );

  const onWebhookDelete = (data: WebhookDelete) => {
    if (data.webhookDelete.errors.length === 0) {
      notify({
        text: intl.formatMessage(commonMessages.savedChanges)
      });
      navigate(webhooksListUrl());
    }
  };

  const onWebhookUpdate = (data: WebhookUpdate) => {
    if (data.webhookUpdate.webhookErrors.length === 0) {
      notify({
        text: intl.formatMessage(commonMessages.savedChanges)
      });
      navigate(webhooksUrl(data.webhookUpdate.webhook.id));
    }
  };

  return (
    <TypedWebhookUpdate onCompleted={onWebhookUpdate}>
      {(webhookUpdate, webhookUpdateOpts) => (
        <TypedWebhookDelete onCompleted={onWebhookDelete}>
          {(webhookDelete, webhookDeleteOpts) => (
            <TypedWebhooksDetailsQuery variables={{ id }}>
              {webhookDetails => {
                const handleRemoveConfirm = () =>
                  webhookDelete({
                    variables: {
                      id
                    }
                  });

                const formErrors = maybe(
                  () => webhookUpdateOpts.data.webhookUpdate.webhookErrors,
                  []
                );

                return (
                  <>
                    <WindowTitle
                      title={maybe(() => webhookDetails.data.webhook.name)}
                    />
                    <WebhooksDetailsPage
                      disabled={webhookDetails.loading}
                      errors={formErrors}
                      saveButtonBarState={webhookUpdateOpts.status}
                      webhook={maybe(() => webhookDetails.data.webhook)}
                      fetchServiceAccounts={searchServiceAccount}
                      services={maybe(() =>
                        searchServiceAccountOpt.data.search.edges.map(
                          edge => edge.node
                        )
                      )}
                      onBack={() => navigate(webhooksListUrl())}
                      onDelete={() => openModal("remove")}
                      onSubmit={data => {
                        webhookUpdate({
                          variables: {
                            id,
                            input: {
                              events: data.allEvents
                                ? [WebhookEventTypeEnum.ANY_EVENTS]
                                : data.events,
                              isActive: data.isActive,
                              name: data.name,
                              secretKey: data.secretKey,
                              serviceAccount: data.serviceAccount,
                              targetUrl: data.targetUrl
                            }
                          }
                        });
                      }}
                    />
                    <WebhookDeleteDialog
                      confirmButtonState={webhookDeleteOpts.status}
                      name={maybe(
                        () => webhookDetails.data.webhook.name,
                        "..."
                      )}
                      onClose={closeModal}
                      onConfirm={handleRemoveConfirm}
                      open={params.action === "remove"}
                    />
                  </>
                );
              }}
            </TypedWebhooksDetailsQuery>
          )}
        </TypedWebhookDelete>
      )}
    </TypedWebhookUpdate>
  );
};
WebhooksDetails.displayName = "WebhooksDetails";
export default WebhooksDetails;
