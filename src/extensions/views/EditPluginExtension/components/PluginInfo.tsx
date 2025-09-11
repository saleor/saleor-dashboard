import { DashboardCard } from "@dashboard/components/Card";
import FormSpacer from "@dashboard/components/FormSpacer";
import Hr from "@dashboard/components/Hr";
import { PluginErrorCode } from "@dashboard/graphql";
import { commonMessages } from "@dashboard/intl";
import getPluginErrorMessage from "@dashboard/utils/errors/plugins";
import { Box, Checkbox, Text } from "@saleor/macaw-ui-next";
import * as React from "react";
import { FormattedMessage, useIntl } from "react-intl";

interface PluginInfoProps {
  data: any;
  description: string;
  errors: any[];
  name: string;
  onChange: (event: React.ChangeEvent<any>) => void;
  disabled: boolean;
}

export const PluginInfo = ({
  data,
  description,
  errors,
  name,
  onChange,
  disabled,
}: PluginInfoProps) => {
  const intl = useIntl();
  const misconfiguredError = errors.find(err => err.code === PluginErrorCode.PLUGIN_MISCONFIGURED);

  return (
    <DashboardCard>
      <DashboardCard.Header>
        <DashboardCard.Title>
          {intl.formatMessage({
            id: "w424P4",
            defaultMessage: "Plugin Information and Status",
            description: "section header",
          })}
        </DashboardCard.Title>
      </DashboardCard.Header>
      <DashboardCard.Content>
        <Box>
          <Text lineHeight={2} fontSize={3} color="default2">
            {intl.formatMessage({
              id: "IUeGzv",
              defaultMessage: "Plugin Name",
              description: "plugin name",
            })}
          </Text>
          <Text display="block" fontWeight="bold">
            {name}
          </Text>
        </Box>
        {description && (
          <Box marginTop={4}>
            <Text fontSize={3} color="default2">
              <FormattedMessage {...commonMessages.description} />
            </Text>
            <Text display="block">{description}</Text>
          </Box>
        )}
        <FormSpacer />
        <Hr />
        <Text
          lineHeight={2}
          fontSize={3}
          marginBottom={2}
          color="default2"
          display="block"
          paddingTop={4}
        >
          {intl.formatMessage({
            id: "bL/Wrc",
            defaultMessage: "Status",
            description: "plugin status",
          })}
        </Text>
        <Checkbox
          checked={data.active}
          disabled={disabled}
          name="active"
          onCheckedChange={value =>
            // @ts-expect-error simulate change event for legacy Form
            onChange({
              target: {
                name: "active",
                value: value,
              },
            })
          }
          data-test-id="plugin-active-checkbox"
        >
          <Text size={3} fontWeight="medium">
            {intl.formatMessage({
              id: "3a5wL8",
              defaultMessage: "Active",
            })}
          </Text>
        </Checkbox>
        {misconfiguredError && (
          <Text color="critical1">{getPluginErrorMessage(misconfiguredError, intl)}</Text>
        )}
      </DashboardCard.Content>
    </DashboardCard>
  );
};

PluginInfo.displayName = "PluginInfo";
