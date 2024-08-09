import { DashboardCard } from "@dashboard/components/Card";
import ControlledCheckbox from "@dashboard/components/ControlledCheckbox";
import FormSpacer from "@dashboard/components/FormSpacer";
import Hr from "@dashboard/components/Hr";
import { PluginErrorCode, PluginErrorFragment } from "@dashboard/graphql";
import { commonMessages } from "@dashboard/intl";
import getPluginErrorMessage from "@dashboard/utils/errors/plugins";
import { Box, Text } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { PluginDetailsPageFormData } from "../PluginsDetailsPage";

interface PluginInfoProps {
  data: PluginDetailsPageFormData;
  description: string;
  errors: PluginErrorFragment[];
  name: string;
  onChange: (event: React.ChangeEvent<any>) => void;
}

const PluginInfo: React.FC<PluginInfoProps> = ({ data, description, errors, name, onChange }) => {
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
        <Text lineHeight={2} fontSize={3} color="default2" display="block" paddingTop={4}>
          {intl.formatMessage({
            id: "bL/Wrc",
            defaultMessage: "Status",
            description: "plugin status",
          })}
        </Text>
        <ControlledCheckbox
          name={"active" as keyof PluginDetailsPageFormData}
          label={
            <Text>
              {intl.formatMessage({
                id: "FA+MRz",
                defaultMessage: "Set plugin as active",
              })}
            </Text>
          }
          checked={data.active}
          onChange={onChange}
        />
        {misconfiguredError && (
          <Text color="critical1">{getPluginErrorMessage(misconfiguredError, intl)}</Text>
        )}
      </DashboardCard.Content>
    </DashboardCard>
  );
};

PluginInfo.displayName = "PluginInfo";
export default PluginInfo;
