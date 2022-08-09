import { customAppUrl } from "@saleor/apps/urls";
import { Backlink } from "@saleor/components/Backlink";
import Container from "@saleor/components/Container";
import Form from "@saleor/components/Form";
import FormSpacer from "@saleor/components/FormSpacer";
import Grid from "@saleor/components/Grid";
import PageHeader from "@saleor/components/PageHeader";
import Savebar from "@saleor/components/Savebar";
import {
  WebhookDetailsQuery,
  WebhookErrorFragment,
  WebhookEventTypeAsyncEnum,
  WebhookEventTypeSyncEnum,
} from "@saleor/graphql";
import useNavigator from "@saleor/hooks/useNavigator";
import { ConfirmButtonTransitionState } from "@saleor/macaw-ui";
import WebhookEvents from "@saleor/webhooks/components/WebhookEvents";
import WebhookInfo from "@saleor/webhooks/components/WebhookInfo";
import WebhookStatus from "@saleor/webhooks/components/WebhookStatus";
import {
  createAsyncEventsSelectHandler,
  createSyncEventsSelectHandler,
} from "@saleor/webhooks/handlers";
import {
  mapAsyncEventsToChoices,
  mapSyncEventsToChoices,
} from "@saleor/webhooks/utils";
import React from "react";
import { useIntl } from "react-intl";

import { getHeaderTitle } from "./messages";

export interface FormData {
  syncEvents: WebhookEventTypeSyncEnum[];
  asyncEvents: WebhookEventTypeAsyncEnum[];
  isActive: boolean;
  name: string;
  secretKey: string | null;
  targetUrl: string;
}

export interface WebhookDetailsPageProps {
  appName: string;
  appId: string;
  disabled: boolean;
  errors: WebhookErrorFragment[];
  webhook?: WebhookDetailsQuery["webhook"];
  saveButtonBarState: ConfirmButtonTransitionState;
  onSubmit: (data: FormData) => void;
}

const WebhookDetailsPage: React.FC<WebhookDetailsPageProps> = ({
  appName,
  appId,
  disabled,
  errors,
  webhook,
  saveButtonBarState,
  onSubmit,
}) => {
  const intl = useIntl();
  const navigate = useNavigator();

  const initialForm: FormData = {
    syncEvents: webhook?.syncEvents?.map(event => event.eventType) || [],
    asyncEvents: webhook?.asyncEvents?.map(event => event.eventType) || [],
    isActive: webhook?.isActive ?? true,
    name: webhook?.name || "",
    secretKey: webhook?.secretKey || "",
    targetUrl: webhook?.targetUrl || "",
  };

  return (
    <Form initial={initialForm} onSubmit={onSubmit}>
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
            <Backlink href={customAppUrl(appId)}>{appName}</Backlink>
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
            <Savebar
              disabled={disabled}
              state={saveButtonBarState}
              onCancel={() => navigate(customAppUrl(appId))}
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
