import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import ControlledSwitch from "@saleor/components/ControlledSwitch";
import {
  createStyles,
  Theme,
  withStyles,
  WithStyles
} from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import React from "react";

import CardTitle from "@saleor/components/CardTitle";
import FormSpacer from "@saleor/components/FormSpacer";
import i18n from "../../../i18n";
import { FormData } from "../PluginsDetailsPage";

interface PluginSettingsProps {
  data: FormData;
  errors: Partial<{
    description: string;
    domain: string;
    name: string;
  }>;
  disabled: boolean;
  onChange: (event: React.ChangeEvent<any>) => void;
}

const styles = (theme: Theme) =>
  createStyles({
    item: {
      marginBottom: 5,
      marginTop: 10
    }
  });

const PluginSettings = withStyles(styles, { name: "PluginSettings" })(
  ({
    data,
    disabled,
    classes,
    errors,
    onChange
  }: PluginSettingsProps & WithStyles<typeof styles>) => (
      <Card>
        <CardTitle
          title={i18n.t("Plugin Settings", {
            context: "plugin configuration"
          })}
        />
        <CardContent>
          {data.configuration.map((configuration, index) => (
            <div className={classes.item} key={`item-${index}`}>
              {configuration.type === "STRING" && (
                <TextField
                  className={classes.item}
                  disabled={disabled}
                  error={!!errors.name}
                  label={configuration.label}
                  name={configuration.name}
                  fullWidth
                  value={configuration.value}
                  onChange={onChange}
                />
              )}
              {configuration.type === "BOOLEAN" && (
                <ControlledSwitch
                  className={classes.item}
                  checked={configuration.value}
                  label={configuration.label}
                  name={configuration.name}
                  onChange={onChange}
                />
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    );
);
PluginSettings.displayName = "PluginSettings";
export default PluginSettings;
