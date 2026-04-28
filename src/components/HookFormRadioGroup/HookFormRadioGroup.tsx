import { RadioGroup, type RadioGroupRootProps, Text } from "@saleor/macaw-ui-next";
import { type ReactNode } from "react";
import {
  type Control,
  type FieldPath,
  type FieldValues,
  type PathValue,
  useController,
} from "react-hook-form";

export interface HookFormRadioGroupChoice<TValue extends string = string> {
  label: ReactNode;
  value: TValue;
  disabled?: boolean;
}

type HookFormRadioGroupProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
> = Omit<
  RadioGroupRootProps,
  "name" | "value" | "onChange" | "onValueChange" | "children" | "error"
> & {
  name: TName;
  control: Control<TFieldValues>;
  choices: Array<HookFormRadioGroupChoice<PathValue<TFieldValues, TName> & string>>;
  onValueChange?: (value: PathValue<TFieldValues, TName> & string) => void;
  errorMessage?: string;
};

export const HookFormRadioGroup = <
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>({
  name,
  control,
  choices,
  onValueChange,
  errorMessage,
  size = "large",
  ...rest
}: HookFormRadioGroupProps<TFieldValues, TName>) => {
  const { field, fieldState } = useController({ name, control });

  return (
    <>
      <RadioGroup
        {...rest}
        size={size}
        name={field.name}
        value={field.value ?? ""}
        error={!!fieldState.error}
        onValueChange={value => {
          const typedValue = value as PathValue<TFieldValues, TName> & string;

          field.onChange(typedValue);
          onValueChange?.(typedValue);
        }}
      >
        {choices.map(({ label, value, disabled }) => (
          <RadioGroup.Item
            key={value}
            value={value}
            id={`${field.name}-${value}`}
            disabled={disabled}
            marginBottom={2}
            data-test-id={value}
            alignItems="flex-start"
            className="simple-radio-group"
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
