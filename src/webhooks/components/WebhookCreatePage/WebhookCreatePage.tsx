import AppHeader from "@saleor/components/AppHeader";
import { ConfirmButtonTransitionState } from "@saleor/components/ConfirmButton";
import Container from "@saleor/components/Container";
import Form from "@saleor/components/Form";
import FormSpacer from "@saleor/components/FormSpacer";
import Grid from "@saleor/components/Grid";
import PageHeader from "@saleor/components/PageHeader";
import SaveButtonBar from "@saleor/components/SaveButtonBar";
import useStateFromProps from "@saleor/hooks/useStateFromProps";
import { sectionNames } from "@saleor/intl";
import { maybe } from "@saleor/misc";
import { UserError } from "@saleor/types";
import { WebhookEventTypeEnum } from "@saleor/types/globalTypes";
import createSingleAutocompleteSelectHandler from "@saleor/utils/handlers/singleAutocompleteSelectChangeHandler";
import WebhookEvents from "@saleor/webhooks/components/WebhookEvents";
import WebhookInfo from "@saleor/webhooks/components/WebhookInfo";
import WebhookStatus from "@saleor/webhooks/components/WebhookStatus";
import React from "react";
import { useIntl } from "react-intl";

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

export interface WebhookCreatePageProps {
  disabled: boolean;
  errors: UserError[];
  services?: Array<{
    id: string;
    name: string;
  }>;
  saveButtonBarState: ConfirmButtonTransitionState;
  fetchServiceAccount: (data: string) => void;
  onBack: () => void;
  onSubmit: (data: FormData) => void;
}

const WebhookCreatePage: React.StatelessComponent<WebhookCreatePageProps> = ({
  disabled,
  errors,
  saveButtonBarState,
  services,
  fetchServiceAccount,
  onBack,
  onSubmit
}) => {
  const intl = useIntl();
  const initialForm: FormData = {
    allEvents: false,
    events: [],
    id: null,
    isActive: false,
    name: null,
    secretKey: "",
    serviceAccount: "",
    targetUrl: ""
  };
  const [
    selectedServiceAcccounts,
    setSelectedServiceAcccounts
  ] = useStateFromProps("");
  const servicesChoiceList = maybe(
    () =>
      services.map(node => ({
        label: node.name,
        value: node.id
      })),
    []
  );

  return (
    <Form errors={errors} initial={initialForm} onSubmit={onSubmit}>
      {({ data, errors, hasChanged, submit, change }) => {
        const handleServiceSelect = createSingleAutocompleteSelectHandler(
          change,
          setSelectedServiceAcccounts,
          servicesChoiceList
        );
        return (
          <Container>
            <AppHeader onBack={onBack}>
              {intl.formatMessage(sectionNames.webhooks)}
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
                  serviceDisplayValue={selectedServiceAcccounts}
                  services={servicesChoiceList}
                  fetchServiceAccount={fetchServiceAccount}
                  errors={errors}
                  serviceOnChange={handleServiceSelect}
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
        );
      }}
    </Form>
  );
};
WebhookCreatePage.displayName = "WebhookCreatePage";
export default WebhookCreatePage;
