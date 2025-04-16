import { Checkbox, CheckboxProps } from "@saleor/macaw-ui-next";
import React from "react";
import { Control, FieldPath, FieldValues, RegisterOptions, useController } from "react-hook-form";

export type HookFormCheckboxProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = Omit<CheckboxProps, "checked" | "onCheckedChange" | "name"> & {
  name: TName;
  control: Control<TFieldValues>;
  rules?: Omit<
    RegisterOptions<TFieldValues, TName>,
    "valueAsNumber" | "valueAsDate" | "setValueAs"
  >;
};

export function HookFormCheckbox<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  name,
  control,
  rules,
  disabled,
  label,
  ...rest
}: HookFormCheckboxProps<TFieldValues, TName>): React.ReactElement {
  const { field, fieldState } = useController({
    name,
    control,
    rules,
  });

  return (
    <Checkbox
      checked={field.value}
      onCheckedChange={field.onChange}
      name={field.name}
      ref={field.ref}
      onBlur={field.onBlur}
      disabled={disabled}
      label={label}
      error={!!fieldState.error}
      // helperText={fieldState.error?.message}
      {...rest}
    />
  );
}
