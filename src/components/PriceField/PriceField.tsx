import { Input, InputProps, Text } from "@saleor/macaw-ui-next";

import { usePriceField } from "./usePriceField";

export interface PriceFieldProps extends Omit<InputProps, "onChange"> {
  className?: string;
  currencySymbol?: string;
  disabled?: boolean;
  error?: boolean;
  hint?: string;
  label?: string;
  name?: string;
  value?: string;
  required?: boolean;
  onChange: (event: { target: { name: string; value: string | null } }) => void;
}

export const PriceField = ({
  className,
  disabled,
  error,
  label,
  hint = "",
  currencySymbol,
  name = "price",
  onChange: onChangeBase,
  required,
  value,
  ...inputProps
}: PriceFieldProps) => {
  const { onChange } = usePriceField(currencySymbol, onChangeBase);

  return (
    <Input
      size="small"
      className={className}
      disabled={disabled}
      label={label}
      data-test-id="price-field"
      error={error}
      helperText={hint}
      value={value ?? ""}
      name={name}
      required={required}
      onChange={onChange}
      type="text"
      inputMode="decimal"
      autoComplete="off"
      endAdornment={
        <Text size={2} marginRight={2}>
          {currencySymbol || ""}
        </Text>
      }
      {...inputProps}
    />
  );
};

PriceField.displayName = "PriceField";
