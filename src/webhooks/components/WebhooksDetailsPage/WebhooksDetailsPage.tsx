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

import { Plugin_plugin } from "../../types/Plugin";
import WebhookInfo from "../WebhookInfo";
import WebhookEvents from "../WebhookEvents";

export interface FormData {
  active: boolean;
  configuration: ConfigurationItemInput[];
}

export interface WebhooksDetailsPageProps {
  disabled: boolean;
  errors: UserError[];
  plugin: Plugin_plugin;
  saveButtonBarState: ConfirmButtonTransitionState;
  onBack: () => void;
  onSubmit: (data: FormData) => void;
}

const WebhooksDetailsPage: React.StatelessComponent<
  WebhooksDetailsPageProps
> = ({ disabled, errors, plugin, saveButtonBarState, onBack, onSubmit }) => {
  const intl = useIntl();
  const initialForm: FormData = {
    active: maybe(() => plugin.active, false),
    configuration: maybe(() => plugin.configuration, [])
  };

  return (
    <Form errors={errors} initial={initialForm} onSubmit={onSubmit}>
      {({ data, errors, hasChanged, submit, set, triggerChange }) => {
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
              <div></div>
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
