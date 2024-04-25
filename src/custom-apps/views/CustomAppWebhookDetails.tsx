import NotFoundPage from "@dashboard/components/NotFoundPage";
import { WindowTitle } from "@dashboard/components/WindowTitle";
import {
  useWebhookDetailsQuery,
  useWebhookUpdateMutation,
  WebhookEventTypeAsyncEnum,
} from "@dashboard/graphql";
import useNotifier from "@dashboard/hooks/useNotifier";
import { commonMessages } from "@dashboard/intl";
import React from "react";
import { useIntl } from "react-intl";

import { extractMutationErrors, getStringOrPlaceholder } from "../../misc";
import WebhookDetailsPage, { WebhookFormData } from "../components/WebhookDetailsPage";
import { useAvailableEvents } from "../hooks";
import { CustomAppUrls } from "../urls";

export interface CustomAppWebhookDetailsProps {
  id: string;
}

export const CustomAppWebhookDetails: React.FC<CustomAppWebhookDetailsProps> = ({ id }) => {
  const notify = useNotifier();
  const intl = useIntl();
  const availableEvents = useAvailableEvents();
  const { data: webhookDetails, loading } = useWebhookDetailsQuery({
    variables: { id },
  });
  const [webhookUpdate, webhookUpdateOpts] = useWebhookUpdateMutation({
    onCompleted: data => {
      const errors = data.webhookUpdate?.errors;
      const webhook = data.webhookUpdate?.webhook;

      if (errors?.length === 0 && webhook) {
        notify({
          status: "success",
          text: intl.formatMessage(commonMessages.savedChanges),
        });
      }
    },
  });
  const webhook = webhookDetails?.webhook;
  const formErrors = webhookUpdateOpts.data?.webhookUpdate?.errors || [];
  const handleSubmit = (data: WebhookFormData) =>
    extractMutationErrors(
      webhookUpdate({
        variables: {
          id,
          input: {
            syncEvents: data.syncEvents,
            asyncEvents: data.asyncEvents.includes(WebhookEventTypeAsyncEnum.ANY_EVENTS)
              ? [WebhookEventTypeAsyncEnum.ANY_EVENTS]
              : data.asyncEvents,
            isActive: data.isActive,
            name: data.name,
            secretKey: data.secretKey,
            targetUrl: data.targetUrl,
            query: data.subscriptionQuery,
            customHeaders: data.customHeaders,
          },
        },
      }),
    );

  if (!webhook && !loading) {
    return <NotFoundPage backHref={CustomAppUrls.resolveAppListUrl()} />;
  }

  return (
    <>
      <WindowTitle title={getStringOrPlaceholder(webhookDetails?.webhook?.name)} />
      <WebhookDetailsPage
        appId={webhook?.app.id ?? ""}
        appName={webhook?.app.name ?? ""}
        disabled={loading}
        errors={formErrors}
        saveButtonBarState={webhookUpdateOpts.status}
        webhook={webhook}
        onSubmit={handleSubmit}
        availableEvents={availableEvents}
      />
    </>
  );
};

CustomAppWebhookDetails.displayName = "CustomAppWebhookDetails";
export default CustomAppWebhookDetails;
