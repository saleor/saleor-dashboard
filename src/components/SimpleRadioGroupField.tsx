import { ChangeEvent } from "@dashboard/hooks/useForm";
import { RadioGroup, Text } from "@saleor/macaw-ui-next";
import React from "react";

type RadioGroupFieldChoice = {
  label: string | React.ReactNode;
  value: string;
  disabled?: boolean;
};

interface SimpleRadioGroupFieldProps {
  name: string;
  value: string;
  error: boolean;
  onChange: (event: ChangeEvent) => void;
  choices: RadioGroupFieldChoice[];
  errorMessage?: string;
}

export const SimpleRadioGroupField: React.FC<SimpleRadioGroupFieldProps> = ({
  name,
  value,
  error,
  onChange,
  choices,
  errorMessage,
}) => {
  return (
    <>
      <RadioGroup
        size="large"
        value={value}
        name="scope"
        error={error}
        onValueChange={value => onChange({ target: { value, name } })}
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
            <Text color={disabled ? "defaultDisabled" : "default1"}>{label}</Text>
          </RadioGroup.Item>
        ))}
      </RadioGroup>

      {errorMessage && <Text color="critical1">{errorMessage}</Text>}
    </>
  );
};
