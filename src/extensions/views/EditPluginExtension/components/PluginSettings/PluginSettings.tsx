// @ts-strict-ignore
import { DashboardCard } from "@dashboard/components/Card";
import { ConfigurationTypeFieldEnum } from "@dashboard/graphql";
import { type ChangeEvent } from "@dashboard/hooks/useForm";
import { type UserError } from "@dashboard/types";
import { getFieldError } from "@dashboard/utils/errors";
import { Box, Checkbox, Input, Text, Textarea } from "@saleor/macaw-ui-next";
import { FormattedMessage, useIntl } from "react-intl";

import { type PluginDetailsPageFormData } from "../PluginsDetailsPage";
import { useSortedConfiguration } from "./useSortedConfiguration";

interface PluginSettingsProps {
  data: PluginDetailsPageFormData;
  errors: UserError[];
  disabled: boolean;
  onChange: (event: ChangeEvent) => void;
}

export const PluginSettings = ({ data, disabled, errors, onChange }: PluginSettingsProps) => {
  const intl = useIntl();

  const { textConfigFields, booleanConfigFields } = useSortedConfiguration(data.configuration);

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
        <Box display="flex" flexDirection="column" gap={4}>
          {textConfigFields.map(field => (
            <Box key={field.name} display="flex" flexDirection="row" alignItems="center">
              {field.type === ConfigurationTypeFieldEnum.MULTILINE ? (
                <Textarea
                  width="100%"
                  disabled={disabled}
                  error={!!getFieldError(errors, "name")}
                  aria-invalid={!!getFieldError(errors, "name")}
                  helperText={field.helpText}
                  label={field.label}
                  name={field.name}
                  maxRows={6}
                  value={field.value}
                  onChange={onChange}
                />
              ) : (
                <Input
                  width="100%"
                  disabled={disabled}
                  error={!!getFieldError(errors, "name")}
                  aria-invalid={!!getFieldError(errors, "name")}
                  helperText={field.helpText}
                  label={field.label}
                  name={field.name}
                  readOnly={field.type === ConfigurationTypeFieldEnum.OUTPUT}
                  onFocus={event => {
                    if (field.type === ConfigurationTypeFieldEnum.OUTPUT) {
                      event.target.select();
                    }
                  }}
                  value={field.value}
                  onChange={onChange}
                />
              )}
            </Box>
          ))}
          {booleanConfigFields.map(field => {
            const descriptionFieldId = `plugin-boolean-description-${field.name}`;

            return (
              <Box key={field.name} display="flex" flexDirection="row" alignItems="center">
                <Box display="flex" flexDirection="column">
                  <Checkbox
                    name={field.name}
                    checked={field.value === "true"}
                    aria-describedby={descriptionFieldId}
                    onCheckedChange={value =>
                      onChange({
                        target: {
                          name: field.name,
                          value: value.toString(),
                        },
                      } as ChangeEvent)
                    }
                    disabled={disabled}
                  >
                    <Text size={3} __marginTop="1px">
                      {field.label}
                    </Text>
                  </Checkbox>
                  {field.helpText && (
                    <Box as="span" color="default2" paddingLeft={5} id={descriptionFieldId}>
                      {field.helpText}
                    </Box>
                  )}
                </Box>
              </Box>
            );
          })}
        </Box>
      </DashboardCard.Content>
    </DashboardCard>
  );
};

PluginSettings.displayName = "PluginSettings";
