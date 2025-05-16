import { InputWithPlaceholder } from "@dashboard/components/InputWithPlaceholder/InputWithPlaceholder";
import { Box } from "@saleor/macaw-ui-next";
import React, { ComponentProps } from "react";
import { FieldValues, useController, UseControllerProps } from "react-hook-form";

import { ExtensionInstallFormData } from "../schema";
import { ManifestErrorMessage } from "./ManifestErrorMessage/ManifestErrorMessage";

type ManifestUrlFieldControllerProps<TFormValues extends FieldValues> =
  UseControllerProps<TFormValues> &
    Omit<
      ComponentProps<typeof InputWithPlaceholder>,
      | "value"
      | "onChange"
      | "onBlur"
      | "error"
      | "aria-invalid"
      | "aria-errormessage"
      | "name"
      | "ref"
    >;

export const ManifestUrlFieldController = <
  TFormValues extends FieldValues = ExtensionInstallFormData,
>(
  props: ManifestUrlFieldControllerProps<TFormValues>,
) => {
  const { name, control, rules, defaultValue, shouldUnregister, disabled, ...inputProps } = props;

  const { field, fieldState } = useController({
    name,
    control,
    rules,
    defaultValue,
    shouldUnregister,
    disabled,
  });

  return (
    <Box display="flex" flexDirection="column" gap={0}>
      <InputWithPlaceholder
        {...field}
        {...inputProps}
        error={!!fieldState.error}
        aria-invalid={!!fieldState.error}
      />
      {fieldState.error && <ManifestErrorMessage marginTop={2} error={fieldState.error} />}
    </Box>
  );
};
