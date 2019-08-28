import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { createStyles, withStyles, WithStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import CardTitle from "@saleor/components/CardTitle";
import ControlledSwitch from "@saleor/components/ControlledSwitch";
import { ConfigurationTypeFieldEnum } from "@saleor/types/globalTypes";
import React from "react";
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

const styles = createStyles({
  item: {
    paddingBottom: 10,
    paddingTop: 10
  }
});

const PluginSettings = withStyles(styles, { name: "PluginSettings" })(
  ({
    data,
    disabled,
    classes,
    errors,
    onChange
  }: PluginSettingsProps & WithStyles<typeof styles>) => {
    return (
      <Card>
        <CardTitle
          title={i18n.t("Plugin Settings", {
            context: "plugin configuration"
          })}
        />
        <CardContent>
          {data.configuration.map((configuration, index) => (
            <div className={classes.item} key={index}>
              {configuration.type === ConfigurationTypeFieldEnum.STRING && (
                <TextField
                  disabled={disabled}
                  error={!!errors.name}
                  label={configuration.label}
                  name={configuration.name}
                  fullWidth
                  value={configuration.value}
                  onChange={onChange}
                />
              )}
              {configuration.type === ConfigurationTypeFieldEnum.BOOLEAN && (
                <ControlledSwitch
                  checked={
                    typeof configuration.value !== "boolean"
                      ? configuration.value === "true"
                      : configuration.value
                  }
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
  }
);
PluginSettings.displayName = "PluginSettings";
export default PluginSettings;
