import { WindowTitle } from "@saleor/components/WindowTitle";
import { DEFAULT_INITIAL_SEARCH_DATA } from "@saleor/config";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import { commonMessages } from "@saleor/intl";
import useServiceAccountSearch from "@saleor/searches/useServiceAccountSearch";
import { WebhookEventTypeEnum } from "@saleor/types/globalTypes";
import { WebhookCreate as WebhookCreateData } from "@saleor/webhooks/types/WebhookCreate";
import React from "react";
import { useIntl } from "react-intl";
import { maybe } from "../../misc";
import WebhookCreatePage, { FormData } from "../components/WebhookCreatePage";
import { TypedWebhookCreate } from "../mutations";
import { webhookListUrl, WebhookListUrlQueryParams, webhookUrl } from "../urls";

export interface WebhooksCreateProps {
  id: string;
  params: WebhookListUrlQueryParams;
}

export const WebhooksCreate: React.FC<WebhooksCreateProps> = () => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const intl = useIntl();
  const {
    search: searchServiceAccount,
    result: searchServiceAccountOpt
  } = useServiceAccountSearch({
    variables: DEFAULT_INITIAL_SEARCH_DATA
  });

  const onSubmit = (data: WebhookCreateData) => {
    if (data.webhookCreate.webhookErrors.length === 0) {
      notify({
        text: intl.formatMessage(commonMessages.savedChanges)
      });
      navigate(webhookUrl(data.webhookCreate.webhook.id));
    }
  };

  const handleBack = () => navigate(webhookListUrl());

  return (
    <TypedWebhookCreate onCompleted={onSubmit}>
      {(webhookCreate, webhookCreateOpts) => {
        const handleSubmit = (data: FormData) =>
          webhookCreate({
            variables: {
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

        return (
          <>
            <WindowTitle
              title={intl.formatMessage({
                defaultMessage: "Create Webhook",
                description: "window title"
              })}
            />
            <WebhookCreatePage
              disabled={false}
              errors={maybe(
                () => webhookCreateOpts.data.webhookCreate.webhookErrors,
                []
              )}
              fetchServiceAccounts={searchServiceAccount}
              services={maybe(() =>
                searchServiceAccountOpt.data.search.edges.map(edge => edge.node)
              )}
              onBack={handleBack}
              onSubmit={handleSubmit}
              saveButtonBarState={webhookCreateOpts.status}
            />
          </>
        );
      }}
    </TypedWebhookCreate>
  );
};
WebhooksCreate.displayName = "WebhooksCreate";
export default WebhooksCreate;
