import { WindowTitle } from "@saleor/components/WindowTitle";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import { commonMessages } from "@saleor/intl";
import { WebhookCreate as WebhookCreateData } from "@saleor/webhooks/types/WebhookCreate";
import { WebhookEventTypeEnum } from "@saleor/types/globalTypes";
import React from "react";
import { useIntl } from "react-intl";

import { getMutationState, maybe } from "../../misc";
import WebhookCreatePage, { FormData } from "../components/WebhookCreatePage";
import { TypedWebhookCreate } from "../mutations";
import { TypedServiceListQuery } from "../queries";
import {
  webhooksListUrl,
  WebhooksListUrlQueryParams,
  webhooksUrl
} from "../urls";

export interface WebhooksCreateProps {
  id: string;
  params: WebhooksListUrlQueryParams;
}

export const WebhooksCreate: React.StatelessComponent<
  WebhooksCreateProps
> = () => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const intl = useIntl();

  const onSubmit = (data: WebhookCreateData) => {
    if (data.webhookCreate.errors.length === 0) {
      notify({
        text: intl.formatMessage(commonMessages.savedChanges)
      });
      navigate(webhooksUrl(data.webhookCreate.webhook.id));
    }
  };

  const handleBack = () => navigate(webhooksListUrl());

  return (
    <TypedWebhookCreate onCompleted={onSubmit}>
      {(WebhookCreate, webhookCreateOpts) => {
        const handleSubmit = (data: FormData) =>
          WebhookCreate({
            variables: {
              input: {
                events: [WebhookEventTypeEnum.ALL_EVENTS],
                isActive: data.isActive,
                name: data.name,
                secretKey: data.secretKey,
                serviceAccount: data.serviceAccount,
                targetUrl: data.targetUrl
              }
            }
          });

        const formTransitionState = getMutationState(
          webhookCreateOpts.called,
          webhookCreateOpts.loading,
          maybe(() => webhookCreateOpts.data.webhookCreate.errors)
        );

        return (
          <TypedServiceListQuery displayLoader variables={{ first: 99 }}>
            {({ data }) => {
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
                      () => webhookCreateOpts.data.webhookCreate.errors,
                      []
                    )}
                    services={maybe(() =>
                      data.serviceAccounts.edges.map(edge => edge.node)
                    )}
                    onBack={handleBack}
                    onSubmit={handleSubmit}
                    saveButtonBarState={formTransitionState}
                  />
                </>
              );
            }}
          </TypedServiceListQuery>
        );
      }}
    </TypedWebhookCreate>
  );
};
WebhooksCreate.displayName = "WebhooksCreate";
export default WebhooksCreate;
