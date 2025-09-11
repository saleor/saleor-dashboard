import { ErrorCircle } from "@dashboard/icons/ErrorCircle";
import { fixedForwardRef } from "@dashboard/utils/ref";
import { Box } from "@saleor/macaw-ui-next";
import { ComponentProps } from "react";
import * as React from "react";
import { FieldValues, useController, UseControllerProps } from "react-hook-form";

import { InputWithPlaceholder } from "../InputWithPlaceholder/InputWithPlaceholder";

const HookFormInputInner = <TFormValues extends FieldValues>(
  {
    name,
    rules,
    control,
    disabled,
    defaultValue,
    shouldUnregister,
    ...componentProps
  }: UseControllerProps<TFormValues> & ComponentProps<typeof InputWithPlaceholder>,
  ref: React.ForwardedRef<HTMLInputElement>,
) => {
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
        ref={ref}
      />
      {fieldState.error && (
        <Box color="default2" display="flex" alignItems="center" gap={2} aria-hidden="true">
          <ErrorCircle __width="16px" __height="16px" flexShrink="0" />
          {fieldState.error.message}
        </Box>
      )}
    </Box>
  );
};

export const HookFormInput = fixedForwardRef(HookFormInputInner);

// Cannot use generic + forwardRef and Component.displayName in the same type
// See fixedForwardRef
(HookFormInput as any).displayName = "HookFormInput";
