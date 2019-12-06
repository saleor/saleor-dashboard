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
import createDialogActionHandlers from "@saleor/utils/handlers/dialogActionHandlers";
import { maybe } from "../../misc";
import WebhooksDetailsPage from "../components/WebhooksDetailsPage";
import { TypedWebhookDelete, TypedWebhookUpdate } from "../mutations";
import { TypedWebhooksDetailsQuery } from "../queries";
import {
  webhookListUrl,
  webhookUrl,
  WebhookUrlDialog,
  WebhookUrlQueryParams
} from "../urls";

export interface WebhooksDetailsProps {
  id: string;
  params: WebhookUrlQueryParams;
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

  const [openModal, closeModal] = createDialogActionHandlers<
    WebhookUrlDialog,
    WebhookUrlQueryParams
  >(navigate, params => webhookUrl(id, params), params);

  const onWebhookDelete = (data: WebhookDelete) => {
    if (data.webhookDelete.errors.length === 0) {
      notify({
        text: intl.formatMessage(commonMessages.savedChanges)
      });
      navigate(webhookListUrl());
    }
  };

  const onWebhookUpdate = (data: WebhookUpdate) => {
    if (data.webhookUpdate.webhookErrors.length === 0) {
      notify({
        text: intl.formatMessage(commonMessages.savedChanges)
      });
      navigate(webhookUrl(data.webhookUpdate.webhook.id));
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
                      onBack={() => navigate(webhookListUrl())}
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
