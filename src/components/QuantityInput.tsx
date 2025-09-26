import { Input, InputProps, Text } from "@saleor/macaw-ui-next";
import { ReactNode } from "react";
import { FormattedMessage } from "react-intl";

interface QuantityInputProps extends InputProps {
  disabled?: boolean;
  className?: string;
  value: number;
  max: number;
  isError?: boolean;
  labels?: {
    outOf?: ReactNode;
    error?: string;
  };
}

export const QuantityInput = ({
  disabled,
  className,
  value,
  onChange,
  max,
  isError,
  labels,
  ...props
}: QuantityInputProps) => (
  <Input
    {...props}
    disabled={disabled}
    className={className}
    type="number"
    __minWidth="40px"
    width="100%"
    value={value}
    onChange={onChange}
    endAdornment={
      <Text minWidth={max > 9 ? 10 : 7} paddingRight={2}>
        {labels?.outOf ?? (
          <FormattedMessage
            id="CWDuMj"
            defaultMessage="/ {max}"
            description="remaining quantity"
            values={{
              max,
            }}
          />
        )}
      </Text>
    }
    max={max}
    min={0}
    textAlign="right"
    error={isError}
    helperText={
      isError && (
        <Text
          color="critical1"
          __marginTop="-2px"
          display="block"
          position="absolute"
          bottom={0}
          fontSize={1}
        >
          {labels?.error ?? (
            <FormattedMessage
              defaultMessage="Improper value"
              id="xoyCZ/"
              description="error message"
            />
          )}
        </Text>
      )
    }
  />
);
