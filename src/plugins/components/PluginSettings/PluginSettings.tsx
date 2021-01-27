import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import makeStyles from "@material-ui/core/styles/makeStyles";
import TextField from "@material-ui/core/TextField";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
import InfoIcon from "@material-ui/icons/Info";
import CardTitle from "@saleor/components/CardTitle";
import ControlledSwitch from "@saleor/components/ControlledSwitch";
import { Plugin_plugin_configuration } from "@saleor/plugins/types/Plugin";
import { UserError } from "@saleor/types";
import { ConfigurationTypeFieldEnum } from "@saleor/types/globalTypes";
import { getFieldError } from "@saleor/utils/errors";
import React from "react";
import { useIntl } from "react-intl";

import { PluginDetailsPageFormData } from "../PluginsDetailsPage";

interface PluginSettingsProps {
  data: PluginDetailsPageFormData;
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
      },
      alignItems: "center",
      display: "flex"
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
                <>
                  <ControlledSwitch
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
                  {fieldData.helpText && (
                    <Tooltip
                      title={
                        <Typography variant="body2">
                          {fieldData.helpText}
                        </Typography>
                      }
                    >
                      <InfoIcon />
                    </Tooltip>
                  )}
                </>
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
