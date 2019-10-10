import AppHeader from "@saleor/components/AppHeader";
import { ConfirmButtonTransitionState } from "@saleor/components/ConfirmButton";
import Container from "@saleor/components/Container";
import Form from "@saleor/components/Form";
import FormSpacer from "@saleor/components/FormSpacer";
import Grid from "@saleor/components/Grid";
import PageHeader from "@saleor/components/PageHeader";
import SaveButtonBar from "@saleor/components/SaveButtonBar";
import { sectionNames } from "@saleor/intl";
import { maybe } from "@saleor/misc";
import { UserError } from "@saleor/types";
import { WebhookEventTypeEnum } from "@saleor/types/globalTypes";
import React from "react";
import { useIntl } from "react-intl";
import { ServiceList_serviceAccounts_edges_node } from "../../types/ServiceList";
import { Webhook_webhook } from "../../types/Webhook";
import WebhookEvents from "../WebhookEvents";
import WebhookInfo from "../WebhookInfo";
import WebhookStatus from "../WebhookStatus";

export interface FormData {
  id: string;
  events: WebhookEventTypeEnum[];
  isActive: boolean;
  name: string;
  secretKey: string | null;
  targetUrl: string;
  serviceAccount: string;
  allEvents: boolean;
}

export interface WebhooksDetailsPageProps {
  disabled: boolean;
  errors: UserError[];
  webhook: Webhook_webhook;
  services: ServiceList_serviceAccounts_edges_node[];
  saveButtonBarState: ConfirmButtonTransitionState;
  onBack: () => void;
  onDelete: () => void;
  onSubmit: (data: FormData) => void;
}

const WebhooksDetailsPage: React.StatelessComponent<
  WebhooksDetailsPageProps
> = ({
  disabled,
  errors,
  webhook,
  saveButtonBarState,
  services,
  onBack,
  onDelete,
  onSubmit
}) => {
  const intl = useIntl();
  const initialForm: FormData = {
    allEvents: maybe(
      () =>
        maybe(() => webhook.events, [])[0].eventType ===
        WebhookEventTypeEnum.ALL_EVENTS,
      false
    ),
    events: maybe(() => webhook.events, []).map(event => event.eventType),
    id: maybe(() => webhook.id, null),
    isActive: maybe(() => webhook.isActive, false),
    name: maybe(() => webhook.name, ""),
    secretKey: maybe(() => webhook.secretKey, ""),
    serviceAccount: maybe(() => webhook.serviceAccount.id, ""),
    targetUrl: maybe(() => webhook.targetUrl, "")
  };
  return (
    <Form errors={errors} initial={initialForm} onSubmit={onSubmit}>
      {({ data, errors, hasChanged, submit, change }) => {
        return (
          <Container>
            <AppHeader onBack={onBack}>
              {intl.formatMessage(sectionNames.plugins)}
            </AppHeader>
            <PageHeader
              title={intl.formatMessage(
                {
                  defaultMessage: "{pluginName} Details",
                  description: "header"
                },
                {
                  pluginName: maybe(() => webhook.name, "...")
                }
              )}
            />
            <Grid>
              <div>
                <WebhookInfo
                  data={data}
                  disabled={disabled}
                  services={maybe(() => services, [])}
                  errors={errors}
                  onChange={change}
                />
              </div>
              <div>
                <WebhookEvents
                  data={data}
                  onChange={change}
                  disabled={disabled}
                />
                <FormSpacer />
                <WebhookStatus
                  data={data}
                  disabled={disabled}
                  onChange={change}
                />
              </div>
            </Grid>
            <SaveButtonBar
              disabled={disabled || !hasChanged}
              state={saveButtonBarState}
              onCancel={onBack}
              onSave={submit}
              onDelete={onDelete}
            />
          </Container>
        );
      }}
    </Form>
  );
};
WebhooksDetailsPage.displayName = "WebhooksDetailsPage";
export default WebhooksDetailsPage;
