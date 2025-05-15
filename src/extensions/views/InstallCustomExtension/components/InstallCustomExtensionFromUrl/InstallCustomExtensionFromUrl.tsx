import { Savebar } from "@dashboard/components/Savebar";
import { messages } from "@dashboard/extensions/messages";
import { ExtensionInstallQueryParams } from "@dashboard/extensions/urls";
import { flattenErrors } from "@dashboard/utils/hook-form/errors";
import { Box } from "@saleor/macaw-ui-next";
import React from "react";
import {
  Control,
  UseFormGetValues,
  UseFormHandleSubmit,
  UseFormSetError,
  useFormState,
  UseFormTrigger,
} from "react-hook-form";
import { FormattedMessage } from "react-intl";

import { previousPagePath } from "../../consts";
import { useFetchManifest } from "../../hooks/useFetchManifest";
import { useInstallApp } from "../../hooks/useInstallApp";
import { useLoadQueryParamsToForm } from "../../hooks/useLoadQueryParamsToForm";
import { ExtensionInstallFormData } from "../../types";
import { InstallSectionData } from "../InstallSectionData";
import { ManifestErrorMessage } from "../ManifestErrorMessage";

export const InstallCustomExtensionFromUrl = ({
  trigger,
  control,
  handleSubmit,
  getValues,
  setError,
  params,
}: {
  control: Control<ExtensionInstallFormData>;
  trigger: UseFormTrigger<ExtensionInstallFormData>;
  handleSubmit: UseFormHandleSubmit<ExtensionInstallFormData>;
  setError: UseFormSetError<ExtensionInstallFormData>;
  getValues: UseFormGetValues<ExtensionInstallFormData>;
  params: ExtensionInstallQueryParams;
}) => {
  const { errors } = useFormState({ control });

  const { submitFetchManifest, manifest, lastFetchedManifestUrl, isFetchingManifest } =
    useFetchManifest({
      getValues,
      setError,
    });

  useLoadQueryParamsToForm({
    trigger,
    onSubmit: handleSubmit(submitFetchManifest),
    params,
  });

  const { submitInstallApp, isSubmittingInstallation } = useInstallApp({
    getValues,
    manifest,
  });

  return (
    <>
      <Box marginX={6} marginTop={10} display="flex" flexDirection="column" gap={10}>
        <InstallSectionData
          isFetchingManifest={isFetchingManifest}
          manifest={manifest}
          lastFetchedManifestUrl={lastFetchedManifestUrl}
          control={control}
          centered
        />
        <ManifestErrorMessage error={errors.manifestUrl} />
      </Box>
      <Savebar>
        <Savebar.Spacer />
        <Savebar.CancelButton href={previousPagePath} />
        <Savebar.ConfirmButton
          disabled={!manifest}
          transitionState={isSubmittingInstallation ? "loading" : "default"}
          onClick={() => submitInstallApp()}
        >
          <FormattedMessage {...messages.install} />
        </Savebar.ConfirmButton>
      </Savebar>
    </>
  );
};
