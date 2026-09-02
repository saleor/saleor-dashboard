import { type ChangeEvent } from "@dashboard/hooks/useForm";
import { RadioGroup } from "@saleor/macaw-ui-next";
import type * as React from "react";

interface RadioSwitchFieldProps {
  className?: string;
  disabled?: boolean;
  error?: boolean;
  firstOptionLabel: React.ReactNode;
  name: string;
  secondOptionLabel: React.ReactNode;
  value?: boolean;
  onChange: (event: ChangeEvent<boolean>) => void;
}

export const RadioSwitchField = ({
  className,
  disabled,
  error,
  firstOptionLabel,
  name,
  secondOptionLabel,
  value,
  onChange,
}: RadioSwitchFieldProps) => (
  <RadioGroup
    className={className}
    name={name}
    value={value ? "true" : "false"}
    error={error}
    onValueChange={selected => onChange({ target: { name, value: selected === "true" } })}
    display="flex"
    flexDirection="column"
    gap={3}
  >
    <RadioGroup.Item id={`${name}-true`} value="true" disabled={disabled}>
      {firstOptionLabel}
    </RadioGroup.Item>
    <RadioGroup.Item id={`${name}-false`} value="false" disabled={disabled}>
      {secondOptionLabel}
    </RadioGroup.Item>
  </RadioGroup>
);
