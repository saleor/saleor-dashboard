import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import TextField from "@material-ui/core/TextField";
import makeStyles from "@material-ui/styles/makeStyles";
import CardTitle from "@saleor/components/CardTitle";
import ControlledSwitch from "@saleor/components/ControlledSwitch";
import { FormErrors } from "@saleor/types";
import { ConfigurationTypeFieldEnum } from "@saleor/types/globalTypes";
import React from "react";
import { useIntl } from "react-intl";

import { FormData } from "../PluginsDetailsPage";

interface PluginSettingsProps {
  data: FormData;
  errors: FormErrors<"name" | "configuration">;
  disabled: boolean;
  onChange: (event: React.ChangeEvent<any>) => void;
  fields: Array<{
    name: string;
    type: ConfigurationTypeFieldEnum | null;
    value: string;
    helpText: string | null;
    label: string | null;
  }>;
}

const useStyles = makeStyles(() => ({
  item: {
    paddingBottom: 10,
    paddingTop: 10
  }
}));

const PluginSettings: React.StatelessComponent<PluginSettingsProps> = ({
  data,
  disabled,
  errors,
  onChange,
  fields
}) => {
  const classes = useStyles({});
  const intl = useIntl();
  return (
    <Card>
      <CardTitle
        title={intl.formatMessage({
          defaultMessage: "Plugin Settings",
          description: "plugin section title"
        })}
      />
      <CardContent>
        {data.configuration.map((configuration, index) => (
          <div className={classes.item} key={index}>
            {fields[index].type === ConfigurationTypeFieldEnum.STRING && (
              <TextField
                disabled={disabled}
                error={!!errors.name}
                helperText={fields[index].helpText}
                label={fields[index].label}
                name={configuration.name}
                fullWidth
                value={configuration.value}
                onChange={onChange}
              />
            )}
            {fields[index].type === ConfigurationTypeFieldEnum.BOOLEAN && (
              <ControlledSwitch
                checked={
                  typeof configuration.value !== "boolean"
                    ? configuration.value === "true"
                    : configuration.value
                }
                disabled={disabled}
                label={fields[index].label}
                name={configuration.name}
                onChange={onChange}
              />
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
PluginSettings.displayName = "PluginSettings";
export default PluginSettings;
