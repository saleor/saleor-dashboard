import AppHeader from "@saleor/components/AppHeader";
import { ConfirmButtonTransitionState } from "@saleor/components/ConfirmButton";
import Container from "@saleor/components/Container";
import Form from "@saleor/components/Form";
import FormSpacer from "@saleor/components/FormSpacer";
import Grid from "@saleor/components/Grid";
import PageHeader from "@saleor/components/PageHeader";
import SaveButtonBar from "@saleor/components/SaveButtonBar";
import { WebhookErrorFragment } from "@saleor/fragments/types/WebhookErrorFragment";
import { WebhookEventTypeEnum } from "@saleor/types/globalTypes";
import WebhookEvents from "@saleor/webhooks/components/WebhookEvents";
import WebhookInfo from "@saleor/webhooks/components/WebhookInfo";
import WebhookStatus from "@saleor/webhooks/components/WebhookStatus";
import React from "react";
import { useIntl } from "react-intl";

export interface FormData {
  events: WebhookEventTypeEnum[];
  isActive: boolean;
  name: string;
  secretKey: string | null;
  targetUrl: string;
  allEvents: boolean;
}

export interface WebhookCreatePageProps {
  appName: string;
  disabled: boolean;
  errors: WebhookErrorFragment[];
  saveButtonBarState: ConfirmButtonTransitionState;
  onBack: () => void;
  onSubmit: (data: FormData) => void;
}

const WebhookCreatePage: React.FC<WebhookCreatePageProps> = ({
  appName = "",
  disabled,
  errors,
  saveButtonBarState,
  onBack,
  onSubmit
}) => {
  const intl = useIntl();
  const initialForm: FormData = {
    allEvents: false,
    events: [],
    isActive: false,
    name: "",
    secretKey: "",
    targetUrl: ""
  };

  return (
    <Form initial={initialForm} onSubmit={onSubmit}>
      {({ data, hasChanged, submit, change }) => (
        <Container>
          <AppHeader onBack={onBack}>{appName}</AppHeader>
          <PageHeader
            title={intl.formatMessage({
              defaultMessage: "Create Webhook",
              description: "header"
            })}
          />
          <Grid>
            <div>
              <WebhookInfo
                data={data}
                disabled={disabled}
                errors={errors}
                onChange={change}
              />
            </div>
            <div>
              <WebhookEvents
                data={data}
                disabled={disabled}
                onChange={change}
              />
              <FormSpacer />
              <WebhookStatus
                data={data.isActive}
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
          />
        </Container>
      )}
    </Form>
  );
};
WebhookCreatePage.displayName = "WebhookCreatePage";
export default WebhookCreatePage;
