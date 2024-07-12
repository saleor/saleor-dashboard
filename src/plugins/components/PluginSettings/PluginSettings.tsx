// @ts-strict-ignore
import { DashboardCard } from "@dashboard/components/Card";
import ControlledSwitch from "@dashboard/components/ControlledSwitch";
import { ConfigurationItemFragment, ConfigurationTypeFieldEnum } from "@dashboard/graphql";
import { UserError } from "@dashboard/types";
import { getFieldError } from "@dashboard/utils/errors";
import { TextField } from "@material-ui/core";
import InfoIcon from "@material-ui/icons/Info";
import { Box, Tooltip } from "@saleor/macaw-ui-next";
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
    <DashboardCard>
      <DashboardCard.Title
        title={intl.formatMessage({
          id: "Egyh2T",
          defaultMessage: "Plugin Settings",
          description: "section header",
        })}
      />
      <DashboardCard.Content>
        {data.configuration.map(field => {
          const fieldData = fields.find(configField => configField.name === field.name);

          return (
            <div className={classes.item} key={field.name}>
              {fieldData.type === ConfigurationTypeFieldEnum.BOOLEAN ? (
                <>
                  <ControlledSwitch
                    name={field.name}
                    label={fieldData.label}
                    checked={
                      typeof field.value !== "boolean" ? field.value === "true" : field.value
                    }
                    onChange={onChange}
                    disabled={disabled}
                  />
                  {fieldData.helpText && (
                    <Tooltip>
                      <Tooltip.Trigger>
                        <InfoIcon />
                      </Tooltip.Trigger>
                      <Tooltip.Content>
                        <Tooltip.Arrow />
                        <Box __maxWidth={350}>{fieldData.helpText}</Box>
                      </Tooltip.Content>
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
                  multiline={fieldData.type === ConfigurationTypeFieldEnum.MULTILINE}
                  InputProps={{
                    rowsMax: 6,
                    readOnly: fieldData.type === ConfigurationTypeFieldEnum.OUTPUT,
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
      </DashboardCard.Content>
    </DashboardCard>
  );
};

PluginSettings.displayName = "PluginSettings";
export default PluginSettings;
