import { ErrorCircle } from "@dashboard/icons/ErrorCircle";
import { Box } from "@saleor/macaw-ui-next";
import React, { ComponentProps } from "react";
import { FieldValues, useController, UseControllerProps } from "react-hook-form";

import { InputWithPlaceholder } from "../InputWithPlaceholder/InputWithPlaceholder";

export function HookFormInput<TFormValues extends FieldValues>({
  name,
  rules,
  control,
  disabled,
  defaultValue,
  shouldUnregister,
  ...componentProps
}: UseControllerProps<TFormValues> & ComponentProps<typeof InputWithPlaceholder>) {
  const { field, fieldState } = useController({
    name,
    rules,
    control,
    disabled,
    defaultValue,
    shouldUnregister,
  });

  return (
    <Box display="flex" flexDirection="column" gap={2}>
      <InputWithPlaceholder
        {...field}
        error={!!fieldState.error}
        aria-invalid={!!fieldState.error}
        aria-errormessage={fieldState.error?.message}
        {...componentProps}
      />
      {fieldState.error && (
        <Box color="default2" display="flex" alignItems="center" gap={2} aria-hidden="true">
          <ErrorCircle width="16px" height="16px" />
          {fieldState.error.message}
        </Box>
      )}
    </Box>
  );
}
