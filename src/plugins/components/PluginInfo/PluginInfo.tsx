import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { createStyles, withStyles, WithStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import React from "react";

import CardTitle from "@saleor/components/CardTitle";
import ControlledSwitch from "@saleor/components/ControlledSwitch";
import FormSpacer from "@saleor/components/FormSpacer";
import Hr from "@saleor/components/Hr";
import i18n from "../../../i18n";
import { FormData } from "../PluginsDetailsPage";
import { Plugin_plugin } from "../../types/Plugin";

interface PluginInfoProps {
  data: FormData;
  plugin: Plugin_plugin;
  onChange: (event: React.ChangeEvent<any>) => void;
}

const styles = createStyles({
  status: {
    paddingTop: 20
  },
  title: {
    fontSize: 14,
    paddingTop: 10
  }
});

const PluginInfo = withStyles(styles, { name: "PluginInfo" })(
  ({
    data,
    plugin,
    classes,
    onChange
  }: PluginInfoProps & WithStyles<typeof styles>) => {
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
          <Typography>{plugin.name}</Typography>
          {plugin.description && (
            <>
              <Typography className={classes.title} variant="h6">
                {i18n.t("Plugin Description")}
              </Typography>
              <Typography>{plugin.description}</Typography>
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
  }
);
PluginInfo.displayName = "PluginInfo";
export default PluginInfo;
