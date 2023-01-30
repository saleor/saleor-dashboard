import { Content } from "@dashboard/components/AppLayout/Content";
import { DetailedContent } from "@dashboard/components/AppLayout/DetailedContent";
import { RightSidebar } from "@dashboard/components/AppLayout/RightSidebar";
import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import Form from "@dashboard/components/Form";
import FormSpacer from "@dashboard/components/FormSpacer";
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
import { parse, print } from "graphql";
import React, { useEffect, useState } from "react";
import { useIntl } from "react-intl";

import WebhookSubscriptionQuery from "../WebhookSubscriptionQuery";
import { getHeaderTitle } from "./messages";

export interface WebhookFormData {
  syncEvents: WebhookEventTypeSyncEnum[];
  asyncEvents: WebhookEventTypeAsyncEnum[];
  isActive: boolean;
  name: string;
  secretKey?: string;
  targetUrl: string;
  subscriptionQuery: string;
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
    prettified = print(parse(webhook?.subscriptionQuery));
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
  };

  const backUrl = CustomAppUrls.resolveAppUrl(appId);

  const [query, setQuery] = useState(prettified);

  useEffect(() => {
    setQuery(prettified);
  }, [prettified]);

  const handleSubmit = (data: WebhookFormData) => {
    onSubmit({ ...data, ...{ subscriptionQuery: query } });
  };

  return (
    <Form confirmLeave initial={initialForm} onSubmit={handleSubmit}>
      {({ data, submit, change }) => {
        const handleSyncEventsSelect = createSyncEventsSelectHandler(
          change,
          data.syncEvents,
          setQuery,
        );
        const handleAsyncEventsSelect = createAsyncEventsSelectHandler(
          change,
          data.asyncEvents,
          query,
          setQuery,
        );

        return (
          <DetailedContent>
            <TopNav href={backUrl} title={getHeaderTitle(intl, webhook)} />
            <Content>
              <WebhookStatus
                data={data.isActive}
                disabled={disabled}
                onChange={change}
              />
            </Content>
            <RightSidebar>
              <WebhookInfo
                data={data}
                disabled={disabled}
                errors={errors}
                onChange={change}
              />
              <FormSpacer />
              <WebhookEvents
                data={data}
                onSyncEventChange={handleSyncEventsSelect}
                onAsyncEventChange={handleAsyncEventsSelect}
              />
              <WebhookSubscriptionQuery
                query={query}
                setQuery={setQuery}
                data={data}
              />
            </RightSidebar>
            <Savebar
              disabled={disabled}
              state={saveButtonBarState}
              onCancel={() => navigate(backUrl)}
              onSubmit={submit}
            />
          </DetailedContent>
        );
      }}
    </Form>
  );
};
WebhookDetailsPage.displayName = "WebhookDetailsPage";
export default WebhookDetailsPage;
