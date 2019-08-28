import Typography from "@material-ui/core/Typography";
import AppHeader from "@saleor/components/AppHeader";
import { ConfirmButtonTransitionState } from "@saleor/components/ConfirmButton";
import Container from "@saleor/components/Container";
import Form from "@saleor/components/Form";
import Grid from "@saleor/components/Grid";
import PageHeader from "@saleor/components/PageHeader";
import SaveButtonBar from "@saleor/components/SaveButtonBar";
import { maybe } from "@saleor/misc";
import { UserError } from "@saleor/types";
import React from "react";

import i18n from "../../../i18n";
import PluginInfo from "../PluginInfo";
import PluginSettings from "../PluginSettings";

export interface FormData {
  name?: string;
  description?: string;
  active: boolean;
  configuration: Array<{
    name: string;
    value: string;
    type: string;
    helpText: string;
    label: string;
  }>;
}

export interface PluginsDetailsPageProps {
  disabled: boolean;
  errors: UserError[];
  plugin: FormData;
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
  const initialForm: FormData = {
    active: maybe(() => plugin.active, false),
    configuration: maybe(() => plugin.configuration, []),
    description: maybe(() => plugin.description, ""),
    name: maybe(() => plugin.name, "")
  };

  return (
    <Form errors={errors} initial={initialForm} onSubmit={onSubmit}>
      {({ data, errors, hasChanged, submit, set, triggerChange }) => {
        const newData = {
          active: data.active,
          configuration: data.configuration
        };

        const onChange = event => {
          const { name, value } = event.target;
          name === "active"
            ? (newData.active = value)
            : (newData.active = data.active);
          newData.configuration.map(item => {
            if (item.name === name) {
              item.value = value;
            }
          });

          triggerChange();
          set(newData);
        };
        return (
          <Container>
            <AppHeader onBack={onBack}>{i18n.t("Plugins")}</AppHeader>
            <PageHeader
              title={`${maybe(() => plugin.name, "")} ${i18n.t("Details")}`}
            />
            <Grid variant="inverted">
              <div>
                <Typography variant="h6">
                  {i18n.t("Plugin Information and Status")}
                </Typography>
                <Typography>
                  {i18n.t(
                    "These are general information about your store. They define what is the URL of your store and what is shown in brow sers taskbar."
                  )}
                </Typography>
              </div>
              <PluginInfo data={data} onChange={onChange} />
              {data.configuration && (
                <>
                  <div>
                    <Typography variant="h6">
                      {i18n.t("Plugin Settings")}
                    </Typography>
                    <Typography>
                      {i18n.t(
                        "This adress will be used to generate invoices and calculate shipping rates. Email adress you provide here will be used as a contact adress for your customers."
                      )}
                    </Typography>
                  </div>
                  <PluginSettings
                    data={data}
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
