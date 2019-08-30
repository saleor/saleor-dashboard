import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import makeStyles from "@material-ui/styles/makeStyles";
import React from "react";
import { useIntl } from "react-intl";

import CardTitle from "@saleor/components/CardTitle";
import ControlledSwitch from "@saleor/components/ControlledSwitch";
import FormSpacer from "@saleor/components/FormSpacer";
import Hr from "@saleor/components/Hr";
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
          description: "plugin title"
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
              {intl.formatMessage({
                defaultMessage: "Plugin Description",
                description: "plugin description"
              })}
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
        <ControlledSwitch
          checked={data.active}
          label={intl.formatMessage({
            defaultMessage: "Set plugin as Active",
            description: "plugin active label"
          })}
          name={"active" as keyof FormData}
          onChange={onChange}
        />
      </CardContent>
    </Card>
  );
};
PluginInfo.displayName = "PluginInfo";
export default PluginInfo;
