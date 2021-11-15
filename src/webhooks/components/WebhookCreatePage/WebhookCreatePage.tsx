import { ConfirmButtonTransitionState } from "@saleor/components/ConfirmButton";
import Container from "@saleor/components/Container";
import Form from "@saleor/components/Form";
import FormSpacer from "@saleor/components/FormSpacer";
import Grid from "@saleor/components/Grid";
import PageHeader from "@saleor/components/PageHeader";
import Savebar from "@saleor/components/Savebar";
import { WebhookErrorFragment } from "@saleor/fragments/types/WebhookErrorFragment";
import { SubmitPromise } from "@saleor/hooks/useForm";
import { Backlink } from "@saleor/macaw-ui";
import { WebhookEventTypeEnum } from "@saleor/types/globalTypes";
import WebhookEvents from "@saleor/webhooks/components/WebhookEvents";
import WebhookInfo from "@saleor/webhooks/components/WebhookInfo";
import WebhookStatus from "@saleor/webhooks/components/WebhookStatus";
import React from "react";
import { useIntl } from "react-intl";

export interface WebhookCreateFormData {
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
  onSubmit: (data: WebhookCreateFormData) => SubmitPromise;
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
  const initialForm: WebhookCreateFormData = {
    allEvents: false,
    events: [],
    isActive: false,
    name: "",
    secretKey: "",
    targetUrl: ""
  };

  return (
    <Form confirmLeave initial={initialForm} onSubmit={onSubmit}>
      {({ data, hasChanged, submit, change }) => (
        <Container>
          <Backlink onClick={onBack}>{appName}</Backlink>
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
          <Savebar
            disabled={disabled || !hasChanged}
            state={saveButtonBarState}
            onCancel={onBack}
            onSubmit={submit}
          />
        </Container>
      )}
    </Form>
  );
};
WebhookCreatePage.displayName = "WebhookCreatePage";
export default WebhookCreatePage;
