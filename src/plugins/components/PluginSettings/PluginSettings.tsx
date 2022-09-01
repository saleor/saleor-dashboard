import {
  Card,
  CardContent,
  TextField,
  Tooltip,
  Typography,
} from "@material-ui/core";
import InfoIcon from "@material-ui/icons/Info";
import CardTitle from "@saleor/components/CardTitle";
import ControlledSwitch from "@saleor/components/ControlledSwitch";
import {
  ConfigurationItemFragment,
  ConfigurationTypeFieldEnum,
} from "@saleor/graphql";
import { UserError } from "@saleor/types";
import { getFieldError } from "@saleor/utils/errors";
import React from "react";
import { useIntl } from "react-intl";

import { PluginDetailsPageFormData } from "../PluginsDetailsPage";
import { useStyles } from "./styles";

interface PluginSettingsProps {
  data: PluginDetailsPageFormData;
  errors: UserError[];
  disabled: boolean;
  onChange: (event: React.ChangeEvent<any>) => void;
  fields: ConfigurationItemFragment[];
}

const PluginSettings: React.FC<PluginSettingsProps> = ({
  data,
  disabled,
  errors,
  onChange,
  fields,
}) => {
  const classes = useStyles({});
  const intl = useIntl();

  return (
    <Card>
      <CardTitle
        title={intl.formatMessage({
          id: "Egyh2T",
          defaultMessage: "Plugin Settings",
          description: "section header",
        })}
      />
      <CardContent>
        {data.configuration.map(field => {
          const fieldData = fields.find(
            configField => configField.name === field.name,
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
                        <Typography variant="body2" className={classes.tooltip}>
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
                  multiline={
                    fieldData.type === ConfigurationTypeFieldEnum.MULTILINE
                  }
                  InputProps={{
                    rowsMax: 6,
                    readOnly:
                      fieldData.type === ConfigurationTypeFieldEnum.OUTPUT,
                  }}
                  onFocus={event => {
                    if (fieldData.type === ConfigurationTypeFieldEnum.OUTPUT) {
                      event.target.select();
                    }
                  }}
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
