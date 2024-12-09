import { ChangeEvent } from "@dashboard/hooks/useForm";
import { RadioGroup, RadioGroupRootProps, Text } from "@saleor/macaw-ui-next";
import * as React from "react";

type RadioGroupFieldChoice = {
  label: string | React.ReactNode;
  value: string;
  disabled?: boolean;
};

interface SimpleRadioGroupFieldProps
  extends Omit<RadioGroupRootProps, "onChange" | "children" | "name"> {
  name: string;
  onChange: (event: ChangeEvent) => void;
  choices: RadioGroupFieldChoice[];
  size?: RadioGroupRootProps["size"];
  errorMessage?: string;
}

// SimpleRadioGroupField is a migration of RadioGroupField "@dashboard/components/RadioGroupField" using Macaw UI
// While migrating to this component note that it doesn't have a label, hint or 'no choices' message.
export const SimpleRadioGroupField = ({
  name,
  value,
  error,
  onChange,
  choices,
  size = "large",
  errorMessage,
  ...props
}: SimpleRadioGroupFieldProps) => {
  return (
    <>
      <RadioGroup
        size={size}
        value={value}
        name={name}
        error={error}
        onValueChange={value => onChange({ target: { value, name } })}
        {...props}
      >
        {choices.map(({ label, value, disabled }) => (
          <RadioGroup.Item
            key={value}
            value={value}
            id={value}
            disabled={disabled}
            marginBottom={2}
            data-test-id={value}
          >
            <Text
              color={disabled ? "defaultDisabled" : "default1"}
              style={{ verticalAlign: "middle" }}
            >
              {label}
            </Text>
          </RadioGroup.Item>
        ))}
      </RadioGroup>

      {errorMessage && <Text color="critical1">{errorMessage}</Text>}
    </>
  );
};
