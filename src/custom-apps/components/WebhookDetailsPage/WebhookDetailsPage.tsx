import { Backlink } from "@saleor/components/Backlink";
import Container from "@saleor/components/Container";
import Form from "@saleor/components/Form";
import FormSpacer from "@saleor/components/FormSpacer";
import Grid from "@saleor/components/Grid";
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
import React from "react";
import { useIntl } from "react-intl";

import { getHeaderTitle } from "./messages";

export interface WebhookFormData {
  syncEvents: WebhookEventTypeSyncEnum[];
  asyncEvents: WebhookEventTypeAsyncEnum[];
  isActive: boolean;
  name: string;
  secretKey: string | null;
  targetUrl: string;
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
