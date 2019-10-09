import Typography from "@material-ui/core/Typography";
import AppHeader from "@saleor/components/AppHeader";
import { ConfirmButtonTransitionState } from "@saleor/components/ConfirmButton";
import Container from "@saleor/components/Container";
import Form from "@saleor/components/Form";
import Grid from "@saleor/components/Grid";
import PageHeader from "@saleor/components/PageHeader";
import SaveButtonBar from "@saleor/components/SaveButtonBar";
import { sectionNames } from "@saleor/intl";
import { maybe } from "@saleor/misc";
import { UserError } from "@saleor/types";
import { ConfigurationItemInput } from "@saleor/types/globalTypes";
import React from "react";
import { useIntl } from "react-intl";

import {
  Webhook_webhook,
  Webhook_webhook_events,
  Webhook_webhook_serviceAccount
} from "../../types/Webhook";
import WebhookEvents from "../WebhookEvents";
import WebhookInfo from "../WebhookInfo";
import WebhookStatus from "../WebhookStatus";

export interface FormData {
  id: string;
  events: Webhook_webhook_events;
  isActive: boolean;
  secretKey: string | null;
  targetUrl: string;
  serviceAccount: Webhook_webhook_serviceAccount;
}

export interface WebhooksDetailsPageProps {
  disabled: boolean;
  errors: UserError[];
  webhook: Webhook_webhook;
  saveButtonBarState: ConfirmButtonTransitionState;
  onBack: () => void;
  onSubmit: (data: FormData) => void;
}

const WebhooksDetailsPage: React.StatelessComponent<
  WebhooksDetailsPageProps
> = ({ disabled, errors, webhook, saveButtonBarState, onBack, onSubmit }) => {
  const intl = useIntl();
  const initialForm: FormData = {
    events: maybe(() => webhook.events, []),
    id: maybe(() => webhook.id, null),
    isActive: maybe(() => webhook.isActive, false),
    secretKey: maybe(() => webhook.secretKey, ""),
    serviceAccount: maybe(() => webhook.serviceAccount, []),
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
                  pluginName: maybe(() => plugin.name, "...")
                }
              )}
            />
            <Grid variant="inverted">
              <div>
                <WebhookInfo
                  data={data}
                  description={maybe(() => plugin.description, "")}
                  errors={errors}
                  onChange={change}
                />
              </div>
              <div>
                <WebhookEvents
                  data={data}
                  errors={errors}
                  name={maybe(() => plugin.name, "")}
                  onChange={change}
                />
                <WebhookStatus
                  data={data}
                  errors={errors}
                  name={maybe(() => plugin.name, "")}
                  onChange={change}
                />
              </div>
            </Grid>
            <SaveButtonBar
              disabled={disabled || !hasChanged}
              state={saveButtonBarState}
              onCancel={onBack}
              onSave={submit}
            />
          </Container>
        );
      }}
    </Form>
  );
};
WebhooksDetailsPage.displayName = "WebhooksDetailsPage";
export default WebhooksDetailsPage;
