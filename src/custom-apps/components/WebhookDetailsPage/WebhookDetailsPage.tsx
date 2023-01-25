import { Content } from "@dashboard/components/AppLayout/Content";
import { DetailedContent } from "@dashboard/components/AppLayout/DetailedContent";
import { RightSidebar } from "@dashboard/components/AppLayout/RightSidebar";
import { Backlink } from "@dashboard/components/Backlink";
import Form from "@dashboard/components/Form";
import FormSpacer from "@dashboard/components/FormSpacer";
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
          <DetailedContent>
            <Content>
              <Backlink href={backUrl}>{appName}</Backlink>
              <PageHeader title={getHeaderTitle(intl, webhook)} />
              <WebhookInfo
                data={data}
                disabled={disabled}
                errors={errors}
                onChange={change}
              />
            </Content>
            <RightSidebar>
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
