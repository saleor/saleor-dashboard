import { useQuery } from "@apollo/client";
import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import Form from "@dashboard/components/Form";
import FormSpacer from "@dashboard/components/FormSpacer";
import { DetailPageLayout } from "@dashboard/components/Layouts";
import Savebar from "@dashboard/components/Savebar";
import WebhookEvents from "@dashboard/custom-apps/components/WebhookEvents";
import WebhookInfo from "@dashboard/custom-apps/components/WebhookInfo";
import WebhookStatus from "@dashboard/custom-apps/components/WebhookStatus";
import {
  createAsyncEventsSelectHandler,
  createSyncEventsSelectHandler,
} from "@dashboard/custom-apps/handlers";
import { CustomAppUrls } from "@dashboard/custom-apps/urls";
import {
  WebhookDetailsFragment,
  WebhookErrorFragment,
  WebhookEventTypeAsyncEnum,
  WebhookEventTypeSyncEnum,
} from "@dashboard/graphql";
import { SubmitPromise } from "@dashboard/hooks/useForm";
import useNavigator from "@dashboard/hooks/useNavigator";
import { ConfirmButtonTransitionState } from "@saleor/macaw-ui";
import { Box } from "@saleor/macaw-ui/next";
import { parse, print } from "graphql";
import React, { useEffect, useState } from "react";
import { useIntl } from "react-intl";

import PermissionAlert from "../PermissionAlert";
import WebhookHeaders from "../WebhookHeaders";
import WebhookSubscriptionQuery from "../WebhookSubscriptionQuery";
import { getHeaderTitle } from "./messages";
import { buildEventsMap, IntrospectionQuery } from "./utils";

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
}

const WebhookDetailsPage: React.FC<WebhookDetailsPageProps> = ({
  appId,
  disabled,
  errors,
  webhook,
  saveButtonBarState,
  onSubmit,
}) => {
  const intl = useIntl();
  const navigate = useNavigator();

  let prettified: string;
  try {
    prettified = print(parse(webhook?.subscriptionQuery || ""));
  } catch {
    prettified = webhook?.subscriptionQuery || "";
  }

  const initialForm: WebhookFormData = {
    syncEvents: webhook?.syncEvents?.map(event => event.eventType) || [],
    asyncEvents: webhook?.asyncEvents?.map(event => event.eventType) || [],
    isActive: !!webhook?.isActive || true,
    name: webhook?.name || "",
    secretKey: webhook?.secretKey || "",
    targetUrl: webhook?.targetUrl || "",
    subscriptionQuery: prettified || "",
    customHeaders: webhook?.customHeaders || "{}",
  };

  const backUrl = CustomAppUrls.resolveAppUrl(appId);

  const [query, setQuery] = useState(prettified);

  useEffect(() => {
    setQuery(prettified);
  }, [prettified]);

  const handleSubmit = (data: WebhookFormData) => {
    onSubmit({ ...data, ...{ subscriptionQuery: query } });
  };

  const { data: introspectionData } = useQuery(IntrospectionQuery, {
    fetchPolicy: "network-only",
  });

  const elements = introspectionData?.__schema?.types || [];
  const availableEvents = buildEventsMap(elements);

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
              <Box padding={9}>
                <WebhookStatus
                  data={data.isActive}
                  disabled={disabled}
                  onChange={change}
                />
                <WebhookInfo
                  data={data}
                  disabled={disabled}
                  errors={errors}
                  onChange={change}
                />
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
                />
                <FormSpacer />
                <PermissionAlert query={query} />
                <FormSpacer />
                <WebhookHeaders data={data} onChange={change} />
              </Box>
            </DetailPageLayout.Content>
            <Savebar
              disabled={disabled}
              state={saveButtonBarState}
              onCancel={() => navigate(backUrl)}
              onSubmit={submit}
            />
          </DetailPageLayout>
        );
      }}
    </Form>
  );
};
WebhookDetailsPage.displayName = "WebhookDetailsPage";
export default WebhookDetailsPage;
