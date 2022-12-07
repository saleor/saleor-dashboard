import { WindowTitle } from "@saleor/components/WindowTitle";
import {
  useAppQuery,
  useWebhookCreateMutation,
  WebhookEventTypeAsyncEnum,
} from "@saleor/graphql";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import { commonMessages } from "@saleor/intl";
import { extractMutationErrors } from "@saleor/misc";
import React from "react";
import { useIntl } from "react-intl";

import WebhookDetailsPage, { FormData } from "../components/WebhookDetailsPage";
import { webhookUrl } from "../urls";

export interface CustomAppWebhookCreateProps {
  appId: string;
}

export const CustomAppWebhookCreate: React.FC<CustomAppWebhookCreateProps> = ({
  appId,
}) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const intl = useIntl();

  const { data } = useAppQuery({ variables: { id: appId } });

  const [webhookCreate, webhookCreateOpts] = useWebhookCreateMutation({
    onCompleted: data => {
      const webhook = data.webhookCreate?.webhook;
      if (webhook && data?.webhookCreate?.errors.length === 0) {
        notify({
          status: "success",
          text: intl.formatMessage(commonMessages.savedChanges),
        });
        navigate(webhookUrl(webhook.id));
      }
    },
  });

  const handleSubmit = (data: FormData) =>
    extractMutationErrors(
      webhookCreate({
        variables: {
          input: {
            app: appId,
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
        title={intl.formatMessage({
          id: "JVaz1C",
          defaultMessage: "Create Webhook",
          description: "window title",
        })}
      />
      <WebhookDetailsPage
        appName={data?.app?.name ?? ""}
        appId={appId}
        disabled={false}
        errors={webhookCreateOpts.data?.webhookCreate?.errors ?? []}
        onSubmit={handleSubmit}
        saveButtonBarState={webhookCreateOpts.status}
      />
    </>
  );
};

CustomAppWebhookCreate.displayName = "CustomAppWebhookCreate";
export default CustomAppWebhookCreate;
