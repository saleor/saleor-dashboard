import { Card, CardContent, Typography } from "@material-ui/core";
import CardTitle from "@saleor/components/CardTitle";
import ControlledCheckbox from "@saleor/components/ControlledCheckbox";
import FormSpacer from "@saleor/components/FormSpacer";
import Hr from "@saleor/components/Hr";
import { PluginErrorCode, PluginErrorFragment } from "@saleor/graphql";
import { commonMessages } from "@saleor/intl";
import { makeStyles } from "@saleor/macaw-ui";
import getPluginErrorMessage from "@saleor/utils/errors/plugins";
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

const PluginInfo: React.FC<PluginInfoProps> = ({
  data,
  description,
  errors,
  name,
  onChange,
}) => {
  const classes = useStyles({});
  const intl = useIntl();

  const misconfiguredError = errors.find(
    err => err.code === PluginErrorCode.PLUGIN_MISCONFIGURED,
  );

  return (
    <Card>
      <CardTitle
        title={intl.formatMessage({
          id: "w424P4",
          defaultMessage: "Plugin Information and Status",
          description: "section header",
        })}
      />
      <CardContent>
        <Typography className={classes.title} variant="h6">
          {intl.formatMessage({
            id: "IUeGzv",
            defaultMessage: "Plugin Name",
            description: "plugin name",
          })}
        </Typography>
        <Typography>{name}</Typography>
        {description && (
          <>
            <Typography className={classes.title} variant="h6">
              <FormattedMessage {...commonMessages.description} />
            </Typography>
            <Typography>{description}</Typography>
          </>
        )}
        <FormSpacer />
        <Hr />
        <Typography className={classes.status}>
          {intl.formatMessage({
            id: "bL/Wrc",
            defaultMessage: "Status",
            description: "plugin status",
          })}
        </Typography>
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
          <Typography color="error">
            {getPluginErrorMessage(misconfiguredError, intl)}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};
PluginInfo.displayName = "PluginInfo";
export default PluginInfo;
