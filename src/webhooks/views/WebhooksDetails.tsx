import { customAppUrl } from "@saleor/apps/urls";
import NotFoundPage from "@saleor/components/NotFoundPage";
import { WindowTitle } from "@saleor/components/WindowTitle";
import {
  useWebhookDetailsQuery,
  useWebhookUpdateMutation,
  WebhookEventTypeAsyncEnum,
} from "@saleor/graphql";
import useNotifier from "@saleor/hooks/useNotifier";
import { commonMessages } from "@saleor/intl";
import React from "react";
import { useIntl } from "react-intl";

import { extractMutationErrors, getStringOrPlaceholder } from "../../misc";
import WebhookDetailsPage from "../components/WebhookDetailsPage";
import { WebhookFormData } from "../components/WebhooksDetailsPage/WebhooksDetailsPage";

export interface WebhooksDetailsProps {
  id: string;
}

export const WebhooksDetails: React.FC<WebhooksDetailsProps> = ({ id }) => {
  const notify = useNotifier();
  const intl = useIntl();

  const { data: webhookDetails, loading } = useWebhookDetailsQuery({
    variables: { id },
  });
  const [webhookUpdate, webhookUpdateOpts] = useWebhookUpdateMutation({
    onCompleted: data => {
      const errors = data.webhookUpdate?.errors;
      const webhook = data.webhookUpdate?.webhook;

      if (errors.length === 0 && webhook) {
        notify({
          status: "success",
          text: intl.formatMessage(commonMessages.savedChanges),
        });
      }
    },
  });

  const webhook = webhookDetails?.webhook;
  const formErrors = webhookUpdateOpts.data?.webhookUpdate.errors || [];

  if (webhook === null) {
    return <NotFoundPage backHref={customAppUrl(webhook.app.id)} />;
  }

  const handleSubmit = (data: WebhookFormData) =>
    extractMutationErrors(
      webhookUpdate({
        variables: {
          id,
          input: {
            syncEvents: data.syncEvents,
            asyncEvents: data.asyncEvents.includes(
              WebhookEventTypeAsyncEnum.ANY_EVENTS,
            )
              ? [WebhookEventTypeAsyncEnum.ANY_EVENTS]
              : data.asyncEvents,
            isActive: data.isActive,
            name: data.name,
            secretKey: data.secretKey,
            targetUrl: data.targetUrl,
          },
        },
      }),
    );

  return (
    <>
      <WindowTitle
        title={getStringOrPlaceholder(webhookDetails?.webhook?.name)}
      />
      <WebhookDetailsPage
        appId={webhook?.app?.id}
        appName={webhook?.app?.name}
        disabled={loading}
        errors={formErrors}
        saveButtonBarState={webhookUpdateOpts.status}
        webhook={webhook}
        onSubmit={handleSubmit}
      />
    </>
  );
};

WebhooksDetails.displayName = "WebhooksDetails";
export default WebhooksDetails;
