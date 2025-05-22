// @ts-strict-ignore
import { DashboardCard } from "@dashboard/components/Card";
import { ConfigurationItemFragment, ConfigurationTypeFieldEnum } from "@dashboard/graphql";
import { ChangeEvent } from "@dashboard/hooks/useForm";
import { UserError } from "@dashboard/types";
import { getFieldError } from "@dashboard/utils/errors";
import { TextField } from "@material-ui/core";
import InfoIcon from "@material-ui/icons/Info";
import { Box, Text, Toggle, Tooltip } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { PluginDetailsPageFormData } from "../PluginsDetailsPage";

interface PluginSettingsProps {
  data: PluginDetailsPageFormData;
  errors: UserError[];
  disabled: boolean;
  onChange: (event: ChangeEvent) => void;
  fields: ConfigurationItemFragment[];
}

export const PluginSettings: React.FC<PluginSettingsProps> = ({
  data,
  disabled,
  errors,
  onChange,
  fields,
}) => {
  const intl = useIntl();

  return (
    <DashboardCard>
      <DashboardCard.Header>
        <DashboardCard.Title>
          {intl.formatMessage({
            id: "Egyh2T",
            defaultMessage: "Plugin Settings",
            description: "section header",
          })}
        </DashboardCard.Title>
      </DashboardCard.Header>
      <DashboardCard.Content>
        {data.configuration.length === 0 && (
          <Text>
            <FormattedMessage
              defaultMessage="Plugin doesn't have any configuration fields"
              id="87NGDZ"
            />
          </Text>
        )}
        {data.configuration.map(field => {
          const fieldData = fields.find(configField => configField.name === field.name);

          return (
            <Box
              key={field.name}
              display="flex"
              flexDirection="row"
              alignItems="center"
              marginBottom={2}
            >
              {fieldData.type === ConfigurationTypeFieldEnum.BOOLEAN ? (
                <>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Toggle
                      name={field.name}
                      pressed={field.value === "true"}
                      onPressedChange={value =>
                        onChange({
                          target: {
                            name: field.name,
                            value: value.toString(),
                          },
                        } as ChangeEvent)
                      }
                      disabled={disabled}
                    >
                      <Text size={3}>{fieldData.label}</Text>
                    </Toggle>
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
                  </Box>
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
            </Box>
          );
        })}
      </DashboardCard.Content>
    </DashboardCard>
  );
};

PluginSettings.displayName = "PluginSettings";
