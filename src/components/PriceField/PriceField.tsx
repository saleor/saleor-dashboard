// @ts-strict-ignore
import { Input, InputProps, Text } from "@saleor/macaw-ui-next";
import React from "react";

import { usePriceField } from "./usePriceField";
export interface PriceFieldProps extends InputProps {
  className?: string;
  currencySymbol?: string;
  disabled?: boolean;
  error?: boolean;
  hint?: string;
  label?: string;
  name?: string;
  value?: string;
  minValue?: string;
  required?: boolean;
  onChange: (event: any) => any;
}

export const PriceField: React.FC<PriceFieldProps> = props => {
  const {
    className,
    disabled,
    error,
    label,
    hint = "",
    currencySymbol,
    name,
    onChange: onChangeBase,
    required,
    value,
    ...inputProps
  } = props;

  const { onChange, onKeyDown, minValue, step } = usePriceField(
    currencySymbol,
    onChangeBase,
  );

  return (
    <Input
      size="small"
      className={className}
      disabled={disabled}
      label={label}
      data-test-id="price-field"
      error={error}
      helperText={hint}
      value={value}
      min={props.minValue || minValue}
      step={step}
      name={name}
      required={required}
      onChange={onChange}
      onKeyDown={onKeyDown}
      type="number"
      endAdornment={
        <Text typeSize={2} marginRight={2}>
          {currencySymbol || ""}
        </Text>
      }
      {...inputProps}
    />
  );
};
PriceField.defaultProps = {
  name: "price",
};

PriceField.displayName = "PriceField";
export default PriceField;
