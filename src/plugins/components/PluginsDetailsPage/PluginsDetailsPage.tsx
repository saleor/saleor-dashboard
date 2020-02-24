import makeStyles from "@material-ui/core/styles/makeStyles";
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

import CardSpacer from "@saleor/components/CardSpacer";
import Hr from "@saleor/components/Hr";
import { ChangeEvent } from "@saleor/hooks/useForm";
import { isSecretField } from "@saleor/plugins/utils";
import { Plugin_plugin } from "../../types/Plugin";
import PluginAuthorization from "../PluginAuthorization";
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
  onClear: (field: string) => void;
  onEdit: (field: string) => void;
  onSubmit: (data: FormData) => void;
}

const useStyles = makeStyles(
  {
    spacer: {
      gridColumnEnd: "span 2"
    }
  },
  {
    name: "PluginsDetailsPage"
  }
);

const PluginsDetailsPage: React.FC<PluginsDetailsPageProps> = props => {
  const {
    disabled,
    errors,
    plugin,
    saveButtonBarState,
    onBack,
    onClear,
    onEdit,
    onSubmit
  } = props;

  const classes = useStyles(props);
  const intl = useIntl();
  const initialForm: FormData = {
    active: maybe(() => plugin.active, false),
    configuration: maybe(() =>
      plugin.configuration
        .filter(field => !isSecretField(plugin.configuration, field.name))
        .map(field => ({
          ...field,
          value: field.value || ""
        }))
    )
  };

  return (
    <Form initial={initialForm} onSubmit={onSubmit}>
      {({ data, hasChanged, submit, set, triggerChange }) => {
        const onChange = (event: ChangeEvent) => {
          const { name, value } = event.target;
          const newData = {
            active: name === "active" ? value : data.active,
            configuration: data.configuration
          };

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
                      "These are general information about your store. They define what is the URL of your store and what is shown in browsers taskbar."
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
                  <Hr className={classes.spacer} />
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
                  <div>
                    <PluginSettings
                      data={data}
                      fields={maybe(() => plugin.configuration, [])}
                      errors={errors}
                      disabled={disabled}
                      onChange={onChange}
                    />
                    {maybe(() =>
                      plugin.configuration.some(field =>
                        isSecretField(plugin.configuration, field.name)
                      )
                    ) && (
                      <>
                        <CardSpacer />
                        <PluginAuthorization
                          fields={plugin.configuration}
                          onClear={onClear}
                          onEdit={onEdit}
                        />
                      </>
                    )}
                  </div>
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
