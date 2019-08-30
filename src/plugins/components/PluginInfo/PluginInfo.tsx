import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import makeStyles from "@material-ui/styles/makeStyles";
import React from "react";

import CardTitle from "@saleor/components/CardTitle";
import ControlledSwitch from "@saleor/components/ControlledSwitch";
import FormSpacer from "@saleor/components/FormSpacer";
import Hr from "@saleor/components/Hr";
import i18n from "../../../i18n";
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
  return (
    <Card>
      <CardTitle
        title={i18n.t("Plugin Information and Status", {
          context: "plugin configuration"
        })}
      />
      <CardContent>
        <Typography className={classes.title} variant="h6">
          {i18n.t("Plugin Name")}
        </Typography>
        <Typography>{name}</Typography>
        {description && (
          <>
            <Typography className={classes.title} variant="h6">
              {i18n.t("Plugin Description")}
            </Typography>
            <Typography>{description}</Typography>
          </>
        )}
        <FormSpacer />
        <Hr />
        <Typography className={classes.status}>{i18n.t("Status")}</Typography>
        <ControlledSwitch
          checked={data.active}
          label={"Set plugin as Active"}
          name={"active" as keyof FormData}
          onChange={onChange}
        />
      </CardContent>
    </Card>
  );
};
PluginInfo.displayName = "PluginInfo";
export default PluginInfo;
