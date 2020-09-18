import { customAppUrl } from "@saleor/apps/urls";
import NotFoundPage from "@saleor/components/NotFoundPage";
import { WindowTitle } from "@saleor/components/WindowTitle";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import { commonMessages } from "@saleor/intl";
import { WebhookEventTypeEnum } from "@saleor/types/globalTypes";
import { WebhookUpdate } from "@saleor/webhooks/types/WebhookUpdate";
import React from "react";
import { useIntl } from "react-intl";

import { getStringOrPlaceholder } from "../../misc";
import WebhooksDetailsPage from "../components/WebhooksDetailsPage";
import { useWebhookUpdateMutation } from "../mutations";
import { useWebhooksDetailsQuery } from "../queries";

export interface WebhooksDetailsProps {
  id: string;
}

export const WebhooksDetails: React.FC<WebhooksDetailsProps> = ({ id }) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const intl = useIntl();

  const onWebhookUpdate = (data: WebhookUpdate) => {
    const errors = data.webhookUpdate?.errors;
    const webhook = data.webhookUpdate?.webhook;

    if (errors.length === 0 && webhook) {
      notify({
        status: "success",
        text: intl.formatMessage(commonMessages.savedChanges)
      });
    }
  };

  const [webhookUpdate, webhookUpdateOpts] = useWebhookUpdateMutation({
    onCompleted: onWebhookUpdate
  });
  const { data: webhookDetails, loading } = useWebhooksDetailsQuery({
    variables: { id }
  });

  const handleOnBack = () =>
    navigate(customAppUrl(webhookDetails.webhook.app.id));

  const webhook = webhookDetails?.webhook;
  const formErrors = webhookUpdateOpts.data?.webhookUpdate.errors || [];

  if (webhook === null) {
    return <NotFoundPage onBack={handleOnBack} />;
  }

  return (
    <>
      <WindowTitle
        title={getStringOrPlaceholder(webhookDetails?.webhook?.name)}
      />
      <WebhooksDetailsPage
        appName={webhook?.app?.name}
        disabled={loading}
        errors={formErrors}
        saveButtonBarState={webhookUpdateOpts.status}
        webhook={webhook}
        onBack={handleOnBack}
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
                targetUrl: data.targetUrl
              }
            }
          });
        }}
      />
    </>
  );
};

WebhooksDetails.displayName = "WebhooksDetails";
export default WebhooksDetails;
