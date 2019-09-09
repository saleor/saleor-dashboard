import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import makeStyles from "@material-ui/styles/makeStyles";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import CardTitle from "@saleor/components/CardTitle";
import ControlledCheckbox from "@saleor/components/ControlledCheckbox";
import FormSpacer from "@saleor/components/FormSpacer";
import Hr from "@saleor/components/Hr";
import { commonMessages } from "@saleor/intl";
import { FormData } from "../PluginsDetailsPage";

interface PluginInfoProps {
  data: FormData;
  description: string;
  name: string;
  onChange: (event: React.ChangeEvent<any>) => void;
}

const useStyles = makeStyles(() => ({
  status: {
    paddingTop: 20
  },
  title: {
    fontSize: 14,
    paddingTop: 10
  }
}));

const PluginInfo: React.StatelessComponent<PluginInfoProps> = ({
  data,
  description,
  name,
  onChange
}) => {
  const classes = useStyles({});
  const intl = useIntl();
  return (
    <Card>
      <CardTitle
        title={intl.formatMessage({
          defaultMessage: "Plugin Information and Status",
          description: "section header"
        })}
      />
      <CardContent>
        <Typography className={classes.title} variant="h6">
          {intl.formatMessage({
            defaultMessage: "Plugin Name",
            description: "plugin name"
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
            defaultMessage: "Status",
            description: "plugin status"
          })}
        </Typography>
        <ControlledCheckbox
          name={"active" as keyof FormData}
          label={intl.formatMessage({
            defaultMessage: "Set plugin as Active"
          })}
          checked={data.active}
          onChange={onChange}
        />
      </CardContent>
    </Card>
  );
};
PluginInfo.displayName = "PluginInfo";
export default PluginInfo;
