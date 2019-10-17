import AppHeader from "@saleor/components/AppHeader";
import { ConfirmButtonTransitionState } from "@saleor/components/ConfirmButton";
import Container from "@saleor/components/Container";
import Form from "@saleor/components/Form";
import FormSpacer from "@saleor/components/FormSpacer";
import Grid from "@saleor/components/Grid";
import PageHeader from "@saleor/components/PageHeader";
import SaveButtonBar from "@saleor/components/SaveButtonBar";
import { SearchServiceAccount_serviceAccounts_edges_node } from "@saleor/containers/SearchServiceAccount/types/SearchServiceAccount";
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
  services?: SearchServiceAccount_serviceAccounts_edges_node[];
  saveButtonBarState: ConfirmButtonTransitionState;
  fetchServiceAccounts: (data: string) => void;
  onBack: () => void;
  onSubmit: (data: FormData) => void;
}

const WebhookCreatePage: React.StatelessComponent<WebhookCreatePageProps> = ({
  disabled,
  errors,
  saveButtonBarState,
  services,
  fetchServiceAccounts,
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
  const [selectedServiceAcccount, setSelectedServiceAcccount] = React.useState(
    ""
  );
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
          setSelectedServiceAcccount,
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
                  serviceDisplayValue={selectedServiceAcccount}
                  services={servicesChoiceList}
                  fetchServiceAccounts={fetchServiceAccounts}
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
