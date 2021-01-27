import { makeStyles } from "@material-ui/core";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import React from "react";

const useStyles = makeStyles(
  () => ({
    labelText: {
      fontSize: 14
    }
  }),
  { name: "ControlledSwitch" }
);

interface ControlledSwitchProps {
  checked: boolean;
  disabled?: boolean;
  label: string | React.ReactNode;
  name: string;
  secondLabel?: string | React.ReactNode;
  uncheckedLabel?: string | React.ReactNode;
  onChange?(event: React.ChangeEvent<any>);
}

export const ControlledSwitch: React.FC<ControlledSwitchProps> = props => {
  const {
    checked,
    disabled,
    onChange,
    label,
    name,
    secondLabel,
    uncheckedLabel
  } = props;

  const classes = useStyles(props);

  return (
    <FormControlLabel
      control={
        <Switch
          onChange={() =>
            onChange({ target: { name, value: !checked } } as any)
          }
          checked={checked}
          color="primary"
          name={name}
        />
      }
      label={
        <div>
          {uncheckedLabel ? (
            checked ? (
              label
            ) : (
              uncheckedLabel
            )
          ) : typeof label === "string" ? (
            <span className={classes.labelText}>{label}</span>
          ) : (
            label
          )}
          <div>{secondLabel ? secondLabel : null}</div>
        </div>
      }
      disabled={disabled}
    />
  );
};
ControlledSwitch.displayName = "ControlledSwitch";
export default ControlledSwitch;
