import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import makeStyles from "@material-ui/core/styles/makeStyles";
import TextField from "@material-ui/core/TextField";
import CardTitle from "@saleor/components/CardTitle";
import ControlledCheckbox from "@saleor/components/ControlledCheckbox";
import { UserError } from "@saleor/types";
import { ConfigurationTypeFieldEnum } from "@saleor/types/globalTypes";
import React from "react";
import { useIntl } from "react-intl";

import { Plugin_plugin_configuration } from "@saleor/plugins/types/Plugin";
import { getFieldError } from "@saleor/utils/errors";
import { FormData } from "../PluginsDetailsPage";

interface PluginSettingsProps {
  data: FormData;
  errors: UserError[];
  disabled: boolean;
  onChange: (event: React.ChangeEvent<any>) => void;
  fields: Plugin_plugin_configuration[];
}

const useStyles = makeStyles(
  theme => ({
    authItem: {
      display: "flex"
    },
    button: {
      marginRight: theme.spacing()
    },
    item: {
      "&:not(:last-child)": {
        marginBottom: theme.spacing(3)
      }
    },
    itemLabel: {
      fontWeight: 500
    },
    spacer: {
      flex: 1
    }
  }),
  { name: "PluginSettings" }
);

const PluginSettings: React.FC<PluginSettingsProps> = ({
  data,
  disabled,
  errors,
  onChange,
  fields
}) => {
  const classes = useStyles({});
  const intl = useIntl();

  return (
    <Card>
      <CardTitle
        title={intl.formatMessage({
          defaultMessage: "Plugin Settings",
          description: "section header"
        })}
      />
      <CardContent>
        {data.configuration.map(field => {
          const fieldData = fields.find(
            configField => configField.name === field.name
          );

          return (
            <div className={classes.item} key={field.name}>
              {fieldData.type === ConfigurationTypeFieldEnum.BOOLEAN ? (
                <ControlledCheckbox
                  name={field.name}
                  label={fieldData.label}
                  checked={
                    typeof field.value !== "boolean"
                      ? field.value === "true"
                      : field.value
                  }
                  onChange={onChange}
                  disabled={disabled}
                />
              ) : (
                <TextField
                  disabled={disabled}
                  error={!!getFieldError(errors, "name")}
                  helperText={fieldData.helpText}
                  label={fieldData.label}
                  name={field.name}
                  fullWidth
                  value={field.value}
                  onChange={onChange}
                />
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};
PluginSettings.displayName = "PluginSettings";
export default PluginSettings;
