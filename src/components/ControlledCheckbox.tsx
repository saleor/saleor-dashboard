// @ts-strict-ignore
import { Checkbox, FormControlLabel } from "@material-ui/core";
import * as React from "react";

export interface ControlledCheckboxProps {
  className?: string;
  name: string;
  label?: React.ReactNode;
  checked: boolean;
  indeterminate?: boolean;
  disabled?: boolean;
  checkedIcon?: React.ReactNode;
  testId?: string;
  onChange: (event: any) => any;
}

export const ControlledCheckbox = ({
  checked,
  disabled,
  name,
  label,
  onChange,
  checkedIcon,
  indeterminate,
  testId,
  ...props
}: ControlledCheckboxProps) => (
  <FormControlLabel
    disabled={disabled}
    control={
      <Checkbox
        data-test-id={testId}
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
