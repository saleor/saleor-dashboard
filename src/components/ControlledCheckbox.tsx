import { Checkbox, FormControlLabel } from "@material-ui/core";
import React from "react";

export interface ControlledCheckboxProps {
  className?: string;
  name: string;
  label?: React.ReactNode;
  checked: boolean;
  indeterminate?: boolean;
  disabled?: boolean;
  checkedIcon?: React.ReactNode;
  onChange(event: any);
}

export const ControlledCheckbox: React.FC<ControlledCheckboxProps> = ({
  checked,
  disabled,
  name,
  label,
  onChange,
  checkedIcon,
  indeterminate,
  ...props
}) => (
  <FormControlLabel
    disabled={disabled}
    control={
      <Checkbox
        checkedIcon={checkedIcon}
        checked={!!checked}
        indeterminate={indeterminate}
        disabled={disabled}
        name={name}
        onChange={() => onChange({ target: { name, value: !checked } })}
      />
    }
    label={label}
    {...props}
  />
);
ControlledCheckbox.displayName = "ControlledCheckbox";
export default ControlledCheckbox;
