// @ts-strict-ignore
import { FormControlLabel, Switch } from "@material-ui/core";
import { Text } from "@saleor/macaw-ui-next";
import React from "react";

interface ControlledSwitchProps {
  className?: string;
  checked: boolean;
  disabled?: boolean;
  label: string | React.ReactNode;
  name: string;
  secondLabel?: string | React.ReactNode;
  uncheckedLabel?: string | React.ReactNode;
  onChange?: (event: React.ChangeEvent<any>) => any;
}

export const ControlledSwitch: React.FC<ControlledSwitchProps> = props => {
  const { checked, disabled, onChange, label, name, secondLabel, uncheckedLabel, className } =
    props;

  return (
    <FormControlLabel
      className={className}
      control={
        <Switch
          onChange={() => onChange({ target: { name, value: !checked } } as any)}
          checked={checked}
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
            <Text>{label}</Text>
          ) : (
            label
          )}
          <div>{secondLabel || null}</div>
        </div>
      }
      disabled={disabled}
    />
  );
};
ControlledSwitch.displayName = "ControlledSwitch";
export default ControlledSwitch;
