import makeStyles from "@material-ui/core/styles/makeStyles";
import Typography from "@material-ui/core/Typography";
import AppHeader from "@saleor/components/AppHeader";
import CardSpacer from "@saleor/components/CardSpacer";
import { ConfirmButtonTransitionState } from "@saleor/components/ConfirmButton";
import Container from "@saleor/components/Container";
import Form from "@saleor/components/Form";
import Grid from "@saleor/components/Grid";
import Hr from "@saleor/components/Hr";
import PageHeader from "@saleor/components/PageHeader";
import SaveButtonBar from "@saleor/components/SaveButtonBar";
import { PluginErrorFragment } from "@saleor/fragments/types/PluginErrorFragment";
import { ChangeEvent } from "@saleor/hooks/useForm";
import { sectionNames } from "@saleor/intl";
import { getStringOrPlaceholder } from "@saleor/misc";
import { isSecretField } from "@saleor/plugins/utils";
import { ConfigurationItemInput } from "@saleor/types/globalTypes";
import React from "react";
import { useIntl } from "react-intl";

import { Plugin_plugin } from "../../types/Plugin";
import PluginAuthorization from "../PluginAuthorization";
import PluginInfo from "../PluginInfo";
import PluginSettings from "../PluginSettings";

export interface PluginDetailsPageFormData {
  active: boolean;
  configuration: ConfigurationItemInput[];
}

export interface PluginsDetailsPageProps {
  disabled: boolean;
  errors: PluginErrorFragment[];
  plugin: Plugin_plugin;
  saveButtonBarState: ConfirmButtonTransitionState;
  onBack: () => void;
  onClear: (field: string) => void;
  onEdit: (field: string) => void;
  onSubmit: (data: PluginDetailsPageFormData) => void;
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
  const initialForm: PluginDetailsPageFormData = {
    active: plugin?.active || false,
    configuration: plugin?.configuration
      ?.filter(field => !isSecretField(plugin?.configuration || [], field.name))
      .map(field => ({
        ...field,
        value: field.value || ""
      }))
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

            plugin.configuration.map(item => {
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
                  pluginName: getStringOrPlaceholder(plugin?.name)
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
                description={plugin?.description || ""}
                errors={errors}
                name={plugin?.name || ""}
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
                  </div>
                  <div>
                    <PluginSettings
                      data={data}
                      fields={plugin?.configuration || []}
                      errors={errors}
                      disabled={disabled}
                      onChange={onChange}
                    />
                    {plugin?.configuration.some(field =>
                      isSecretField(plugin.configuration, field.name)
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
