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
import PluginInfo from "../PluginInfo";
import PluginSettings from "../PluginSettings";

export interface FormData {
  active: boolean;
  configuration: ConfigurationItemInput[];
}

export interface PluginsDetailsPageProps {
  disabled: boolean;
  errors: UserError[];
  plugin: Plugin_plugin;
  saveButtonBarState: ConfirmButtonTransitionState;
  onBack: () => void;
  onSubmit: (data: FormData) => void;
}

const PluginsDetailsPage: React.StatelessComponent<PluginsDetailsPageProps> = ({
  disabled,
  errors,
  plugin,
  saveButtonBarState,
  onBack,
  onSubmit
}) => {
  const intl = useIntl();
  const initialForm: FormData = {
    active: maybe(() => plugin.active, false),
    configuration: maybe(() => plugin.configuration, [])
  };

  return (
    <Form errors={errors} initial={initialForm} onSubmit={onSubmit}>
      {({ data, errors, hasChanged, submit, set, triggerChange }) => {
        const onChange = event => {
          const newData = {
            active: data.active,
            configuration: data.configuration
          };
          const { name, value } = event.target;
          name === "active"
            ? (newData.active = value)
            : (newData.active = data.active);
          if (newData.configuration) {
            newData.configuration.map(item => {
              if (item.name === name) {
                item.value = value;
              }
            });
          }
          triggerChange();
          set(newData);
        };
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
                <Typography variant="h6">
                  {intl.formatMessage({
                    defaultMessage: "Plugin Information and Status",
                    description: "section header"
                  })}
                </Typography>
                <Typography>
                  {intl.formatMessage({
                    defaultMessage:
                      "These are general information about your store. They define what is the URL of your store and what is shown in brow sers taskbar."
                  })}
                </Typography>
              </div>
              <PluginInfo
                data={data}
                description={maybe(() => plugin.description, "")}
                name={maybe(() => plugin.name, "")}
                onChange={onChange}
              />
              {data.configuration && (
                <>
                  <div>
                    <Typography variant="h6">
                      {intl.formatMessage({
                        defaultMessage: "Plugin Settings",
                        description: "section header"
                      })}
                    </Typography>
                    <Typography>
                      {intl.formatMessage({
                        defaultMessage:
                          "This adress will be used to generate invoices and calculate shipping rates. Email adress you provide here will be used as a contact adress for your customers."
                      })}
                    </Typography>
                  </div>
                  <PluginSettings
                    data={data}
                    fields={maybe(() => plugin.configuration, [])}
                    errors={errors}
                    disabled={disabled}
                    onChange={onChange}
                  />
                </>
              )}
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
PluginsDetailsPage.displayName = "PluginsDetailsPage";
export default PluginsDetailsPage;
