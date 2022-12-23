import { Backlink } from "@saleor/components/Backlink";
import Container from "@saleor/components/Container";
import Form from "@saleor/components/Form";
import FormSpacer from "@saleor/components/FormSpacer";
import PageHeader from "@saleor/components/PageHeader";
import Savebar from "@saleor/components/Savebar";
import WebhookEvents from "@saleor/custom-apps/components/WebhookEvents";
import WebhookInfo from "@saleor/custom-apps/components/WebhookInfo";
import WebhookStatus from "@saleor/custom-apps/components/WebhookStatus";
import {
  createAsyncEventsSelectHandler,
  createSyncEventsSelectHandler,
} from "@saleor/custom-apps/handlers";
import { CustomAppUrls } from "@saleor/custom-apps/urls";
import {
  mapAsyncEventsToChoices,
  mapSyncEventsToChoices,
} from "@saleor/custom-apps/utils";
import {
  WebhookDetailsFragment,
  WebhookErrorFragment,
  WebhookEventTypeAsyncEnum,
  WebhookEventTypeSyncEnum,
} from "@saleor/graphql";
import { SubmitPromise } from "@saleor/hooks/useForm";
import useNavigator from "@saleor/hooks/useNavigator";
import { ConfirmButtonTransitionState } from "@saleor/macaw-ui";
import { parse, print } from "graphql";
import React, { useEffect, useState } from "react";
import { useIntl } from "react-intl";

import WebhookSubscriptionQuery from "../WebhookSubscriptionQuery/WebhookSubscriptionQuery";
import { getHeaderTitle } from "./messages";

export interface WebhookFormData {
  syncEvents: WebhookEventTypeSyncEnum[];
  asyncEvents: WebhookEventTypeAsyncEnum[];
  isActive: boolean;
  name: string;
  secretKey: string | null;
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
  appName,
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
    isActive: !!webhook?.isActive,
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
        const syncEventsChoices = disabled
          ? []
          : mapSyncEventsToChoices(Object.values(WebhookEventTypeSyncEnum));
        const asyncEventsChoices = disabled
          ? []
          : mapAsyncEventsToChoices(
              Object.values(WebhookEventTypeAsyncEnum),
              data.asyncEvents,
            );

        const handleSyncEventsSelect = createSyncEventsSelectHandler(
          change,
          data.syncEvents,
        );
        const handleAsyncEventsSelect = createAsyncEventsSelectHandler(
          change,
          data.asyncEvents,
          query,
          setQuery,
        );

        return (
          <Container>
            <Backlink href={backUrl}>{appName}</Backlink>
            <PageHeader title={getHeaderTitle(intl, webhook)}>
              <WebhookStatus
                data={data.isActive}
                disabled={disabled}
                onChange={change}
              />
            </PageHeader>
            <WebhookInfo
              data={data}
              disabled={disabled}
              errors={errors}
              onChange={change}
            />
            <FormSpacer />
            <WebhookEvents
              data={data}
              syncEventsChoices={syncEventsChoices}
              asyncEventsChoices={asyncEventsChoices}
              onSyncEventChange={handleSyncEventsSelect}
              onAsyncEventChange={handleAsyncEventsSelect}
            />
            <FormSpacer />
            <WebhookSubscriptionQuery query={query} setQuery={setQuery} />
            <Savebar
              disabled={disabled}
              state={saveButtonBarState}
              onCancel={() => navigate(backUrl)}
              onSubmit={submit}
            />
          </Container>
        );
      }}
    </Form>
  );
};
WebhookDetailsPage.displayName = "WebhookDetailsPage";
export default WebhookDetailsPage;
