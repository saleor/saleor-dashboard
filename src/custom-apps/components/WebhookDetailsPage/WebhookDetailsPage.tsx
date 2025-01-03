import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import { ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import Form from "@dashboard/components/Form";
import FormSpacer from "@dashboard/components/FormSpacer";
import { DetailPageLayout } from "@dashboard/components/Layouts";
import { Savebar } from "@dashboard/components/Savebar";
import WebhookEvents from "@dashboard/custom-apps/components/WebhookEvents";
import WebhookInfo from "@dashboard/custom-apps/components/WebhookInfo";
import WebhookStatus from "@dashboard/custom-apps/components/WebhookStatus";
import {
  createAsyncEventsSelectHandler,
  createSyncEventsSelectHandler,
} from "@dashboard/custom-apps/handlers";
import { CustomAppUrls } from "@dashboard/custom-apps/urls";
import { IntrospectionNode } from "@dashboard/custom-apps/utils";
import {
  WebhookDetailsFragment,
  WebhookErrorCode,
  WebhookErrorFragment,
  WebhookEventTypeAsyncEnum,
  WebhookEventTypeSyncEnum,
} from "@dashboard/graphql";
import { SubmitPromise } from "@dashboard/hooks/useForm";
import useNavigator from "@dashboard/hooks/useNavigator";
import { Box } from "@saleor/macaw-ui-next";
import { parse, print } from "graphql";
import { useEffect, useState } from "react";
import * as React from "react";
import { useIntl } from "react-intl";

import PermissionAlert from "../PermissionAlert";
import WebhookHeaders from "../WebhookHeaders";
import WebhookSubscriptionQuery from "../WebhookSubscriptionQuery";
import { getHeaderTitle, messages } from "./messages";
import { getWebhookFormInitialFormValues } from "./webhookForm";

export interface WebhookFormData {
  syncEvents: WebhookEventTypeSyncEnum[];
  asyncEvents: WebhookEventTypeAsyncEnum[];
  isActive: boolean;
  name: string;
  secretKey?: string;
  targetUrl: string;
  subscriptionQuery: string;
  customHeaders: string;
}

export interface WebhookDetailsPageProps {
  appId: string;
  appName: string;
  disabled: boolean;
  errors: WebhookErrorFragment[];
  webhook?: WebhookDetailsFragment | null;
  saveButtonBarState: ConfirmButtonTransitionState;
  onSubmit: (data: WebhookFormData) => SubmitPromise<any[]>;
  availableEvents: IntrospectionNode[];
}

const WebhookDetailsPage = ({
  appId,
  disabled,
  errors,
  webhook,
  saveButtonBarState,
  onSubmit,
  availableEvents,
}: WebhookDetailsPageProps) => {
  const intl = useIntl();
  const navigate = useNavigator();

  let prettified: string;

  try {
    prettified = print(parse(webhook?.subscriptionQuery || ""));
  } catch {
    prettified = webhook?.subscriptionQuery || "";
  }

  const initialForm = getWebhookFormInitialFormValues({ webhook, prettifiedQuery: prettified });

  const backUrl = CustomAppUrls.resolveAppUrl(appId);
  const [query, setQuery] = useState(prettified);

  useEffect(() => {
    setQuery(prettified);
  }, [prettified]);

  const [localErrors, setLocalErrors] = React.useState<WebhookErrorFragment[]>([]);
  const handleSubmit = (data: WebhookFormData) => {
    if (!webhook && query.length === 0) {
      setLocalErrors([
        {
          __typename: "WebhookError",
          code: WebhookErrorCode.REQUIRED,
          field: "subscriptionQuery",
          message: intl.formatMessage(messages.subscriptionQueryBlankError),
        },
      ]);

      return;
    }

    onSubmit({ ...data, ...{ subscriptionQuery: query } });
  };

  return (
    <Form confirmLeave initial={initialForm} onSubmit={handleSubmit}>
      {({ data, submit, change }) => {
        const handleSyncEventsSelect = createSyncEventsSelectHandler({
          change,
          data,
          query,
          setQuery,
          availableEvents,
        });
        const handleAsyncEventsSelect = createAsyncEventsSelectHandler({
          change,
          data,
          query,
          setQuery,
          availableEvents,
        });

        return (
          <DetailPageLayout gridTemplateColumns={1}>
            <TopNav href={backUrl} title={getHeaderTitle(intl, webhook)} />
            <DetailPageLayout.Content>
              <Box padding={6}>
                <WebhookStatus data={data.isActive} disabled={disabled} onChange={change} />
                <WebhookInfo data={data} disabled={disabled} errors={errors} onChange={change} />
              </Box>
              <FormSpacer />
              <Box>
                <WebhookEvents
                  data={data}
                  setQuery={setQuery}
                  onSyncEventChange={handleSyncEventsSelect}
                  onAsyncEventChange={handleAsyncEventsSelect}
                />

                <WebhookSubscriptionQuery
                  query={query}
                  setQuery={setQuery}
                  data={data}
                  errors={localErrors}
                />
                <FormSpacer />
                <PermissionAlert query={query} />
                <FormSpacer />
                <WebhookHeaders data={data} onChange={change} />
              </Box>
            </DetailPageLayout.Content>
            <Savebar>
              <Savebar.Spacer />
              <Savebar.CancelButton onClick={() => navigate(backUrl)} />
              <Savebar.ConfirmButton
                transitionState={saveButtonBarState}
                onClick={submit}
                disabled={disabled}
              />
            </Savebar>
          </DetailPageLayout>
        );
      }}
    </Form>
  );
};

WebhookDetailsPage.displayName = "WebhookDetailsPage";
export default WebhookDetailsPage;
