import { InputWithPlaceholder } from "@dashboard/components/InputWithPlaceholder/InputWithPlaceholder";
import { Box } from "@saleor/macaw-ui-next";
import { type ComponentProps } from "react";
import { type FieldValues, useController, type UseControllerProps } from "react-hook-form";

import { type AlreadyInstalledApp } from "../hooks/useFetchManifest";
import { type ExtensionInstallFormData } from "../schema";
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
  props: ManifestUrlFieldControllerProps<TFormValues> & {
    alreadyInstalledApp?: AlreadyInstalledApp | null;
  },
) => {
  const {
    name,
    control,
    rules,
    defaultValue,
    shouldUnregister,
    disabled,
    alreadyInstalledApp,
    ...inputProps
  } = props;

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
      {alreadyInstalledApp ? (
        <ManifestErrorMessage marginTop={2} alreadyInstalledApp={alreadyInstalledApp} />
      ) : (
        fieldState.error && <ManifestErrorMessage marginTop={2} error={fieldState.error} />
      )}
    </Box>
  );
};
