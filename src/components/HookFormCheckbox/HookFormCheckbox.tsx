import { fixedForwardRef, useCombinedRefs } from "@dashboard/utils/ref";
import { Checkbox, CheckboxProps } from "@saleor/macaw-ui-next";
import React, { ForwardedRef } from "react";
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

function HookFormCheckboxInner<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(
  { name, control, rules, disabled, label, ...rest }: HookFormCheckboxProps<TFieldValues, TName>,
  ref: ForwardedRef<HTMLInputElement>,
): React.ReactElement {
  const { field, fieldState } = useController({
    name,
    control,
    rules,
  });

  const combinedRef = useCombinedRefs(ref, field.ref);

  return (
    <Checkbox
      checked={field.value}
      onCheckedChange={field.onChange}
      name={field.name}
      onBlur={field.onBlur}
      disabled={disabled}
      label={label}
      error={!!fieldState.error}
      ref={combinedRef}
      {...rest}
    />
  );
}

export const HookFormCheckbox = fixedForwardRef(HookFormCheckboxInner);
