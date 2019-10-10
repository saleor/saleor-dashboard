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
import React from "react";
import { useIntl } from "react-intl";
import { ServiceList_serviceAccounts_edges_node } from "../../types/ServiceList";
import WebhookEvents from "../WebhookEvents";
import WebhookInfo from "../WebhookInfo";
import WebhookStatus from "../WebhookStatus";

export interface FormData {
  id: string;
  events: string[];
  isActive: boolean;
  name: string;
  secretKey: string | null;
  targetUrl: string;
  serviceAccount: string;
}

export interface WebhookCreatePageProps {
  disabled: boolean;
  errors: UserError[];
  services: ServiceList_serviceAccounts_edges_node[];
  saveButtonBarState: ConfirmButtonTransitionState;
  onBack: () => void;
  onSubmit: (data: FormData) => void;
}

const WebhookCreatePage: React.StatelessComponent<WebhookCreatePageProps> = ({
  disabled,
  errors,
  saveButtonBarState,
  services,
  onBack,
  onSubmit
}) => {
  const intl = useIntl();
  const initialForm: FormData = {
    events: [],
    id: null,
    isActive: false,
    name: null,
    secretKey: "",
    serviceAccount: "",
    targetUrl: ""
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
                  services={maybe(() => services, [])}
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
            />
          </Container>
        );
      }}
    </Form>
  );
};
WebhookCreatePage.displayName = "WebhookCreatePage";
export default WebhookCreatePage;
