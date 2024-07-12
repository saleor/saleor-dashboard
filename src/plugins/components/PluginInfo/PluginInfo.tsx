import { DashboardCard } from "@dashboard/components/Card";
import ControlledCheckbox from "@dashboard/components/ControlledCheckbox";
import FormSpacer from "@dashboard/components/FormSpacer";
import Hr from "@dashboard/components/Hr";
import { PluginErrorCode, PluginErrorFragment } from "@dashboard/graphql";
import { commonMessages } from "@dashboard/intl";
import getPluginErrorMessage from "@dashboard/utils/errors/plugins";
import { makeStyles } from "@saleor/macaw-ui";
import { Text } from "@saleor/macaw-ui-next";
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

const useStyles = makeStyles(
  () => ({
    status: {
      paddingTop: 20,
    },
    title: {
      fontSize: 14,
      paddingTop: 10,
    },
  }),
  { name: "PluginInfo" },
);
const PluginInfo: React.FC<PluginInfoProps> = ({ data, description, errors, name, onChange }) => {
  const classes = useStyles({});
  const intl = useIntl();
  const misconfiguredError = errors.find(err => err.code === PluginErrorCode.PLUGIN_MISCONFIGURED);

  return (
    <DashboardCard>
      <DashboardCard.Title
        title={intl.formatMessage({
          id: "w424P4",
          defaultMessage: "Plugin Information and Status",
          description: "section header",
        })}
      />
      <DashboardCard.Content>
        <Text className={classes.title} fontWeight="bold" lineHeight={2}>
          {intl.formatMessage({
            id: "IUeGzv",
            defaultMessage: "Plugin Name",
            description: "plugin name",
          })}
        </Text>
        <Text>{name}</Text>
        {description && (
          <>
            <Text className={classes.title} fontWeight="bold" lineHeight={2}>
              <FormattedMessage {...commonMessages.description} />
            </Text>
            <Text>{description}</Text>
          </>
        )}
        <FormSpacer />
        <Hr />
        <Text className={classes.status}>
          {intl.formatMessage({
            id: "bL/Wrc",
            defaultMessage: "Status",
            description: "plugin status",
          })}
        </Text>
        <ControlledCheckbox
          name={"active" as keyof PluginDetailsPageFormData}
          label={intl.formatMessage({
            id: "FA+MRz",
            defaultMessage: "Set plugin as active",
          })}
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
