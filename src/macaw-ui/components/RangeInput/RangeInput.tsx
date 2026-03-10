import { forwardRef } from "react";

import { Input, InputProps } from "..";

export type RangeValue = [string, string];

export type RangeInputProps = {
  value?: RangeValue;
  onChange?: (value: RangeValue) => void;
  children?: React.ReactNode;
  type?: "number" | "date" | "time" | "datetime-local";
} & Omit<InputProps, "onChange" | "value" | "type">;

export const RangeInput = forwardRef<HTMLInputElement, RangeInputProps>(
  (
    { value = ["", ""], onChange, children, type = "number", ...props },
    ref
  ) => {
    const [start, end] = value;
    return (
      <>
        <Input
          value={start}
          onChange={(e) => onChange?.([e.target.value, end])}
          type={type}
          ref={ref}
          data-macaw-ui-component="RangeInput"
          {...props}
        />
        {children}
        <Input
          value={end}
          onChange={(e) => onChange?.([start, e.target.value])}
          type={type}
          ref={ref}
          data-macaw-ui-component="RangeInput"
          {...props}
        />
      </>
    );
  }
);

RangeInput.displayName = "RangeInput";
