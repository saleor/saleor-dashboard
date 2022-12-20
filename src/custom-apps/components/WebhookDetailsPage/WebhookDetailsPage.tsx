import { Backlink } from "@dashboard/components/Backlink";
import Container from "@dashboard/components/Container";
import Form from "@dashboard/components/Form";
import FormSpacer from "@dashboard/components/FormSpacer";
import Grid from "@dashboard/components/Grid";
import PageHeader from "@dashboard/components/PageHeader";
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
  mapAsyncEventsToChoices,
  mapSyncEventsToChoices,
} from "@dashboard/custom-apps/utils";
import {
  WebhookDetailsFragment,
  WebhookErrorFragment,
  WebhookEventTypeAsyncEnum,
  WebhookEventTypeSyncEnum,
} from "@dashboard/graphql";
import { SubmitPromise } from "@dashboard/hooks/useForm";
import useNavigator from "@dashboard/hooks/useNavigator";
import { ConfirmButtonTransitionState } from "@saleor/macaw-ui";
import React from "react";
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

  const initialForm: WebhookFormData = {
    syncEvents: webhook?.syncEvents?.map(event => event.eventType) || [],
    asyncEvents: webhook?.asyncEvents?.map(event => event.eventType) || [],
    isActive: !!webhook?.isActive,
    name: webhook?.name || "",
    secretKey: webhook?.secretKey || "",
    targetUrl: webhook?.targetUrl || "",
    subscriptionQuery: webhook?.subscriptionQuery || "",
  };

  const backUrl = CustomAppUrls.resolveAppUrl(appId);

  return (
    <Form confirmLeave initial={initialForm} onSubmit={onSubmit}>
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
        );

        return (
          <Container>
            <Backlink href={backUrl}>{appName}</Backlink>
            <PageHeader title={getHeaderTitle(intl, webhook)} />
            <Grid variant="uniform">
              <div>
                <WebhookInfo
                  data={data}
                  disabled={disabled}
                  errors={errors}
                  onChange={change}
                />
              </div>
              <div>
                <WebhookStatus
                  data={data.isActive}
                  disabled={disabled}
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
              </div>
            </Grid>
            <FormSpacer />
            <WebhookSubscriptionQuery
              data={data}
              onChange={change}
              errors={errors}
            />
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
