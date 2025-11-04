import { Savebar } from "@dashboard/components/Savebar";
import { ExtensionManifestValidator } from "@dashboard/extensions/domain/extension-manifest-validator";
import { headerTitles, messages } from "@dashboard/extensions/messages";
import { ExtensionInstallQueryParams } from "@dashboard/extensions/urls";
import { Box } from "@saleor/macaw-ui-next";
import { useMemo } from "react";
import {
  Control,
  UseFormGetValues,
  UseFormHandleSubmit,
  UseFormSetError,
  useFormState,
  UseFormTrigger,
} from "react-hook-form";
import { FormattedMessage, useIntl } from "react-intl";

import { previousPagePath } from "../../consts";
import { useFetchManifest } from "../../hooks/useFetchManifest";
import { useInstallApp } from "../../hooks/useInstallApp";
import { useLoadQueryParamsToForm } from "../../hooks/useLoadQueryParamsToForm";
import { ExtensionInstallFormData } from "../../types";
import { InstallSectionData } from "../InstallSectionData/InstallSectionData";
import { InstallTopNav } from "../InstallTopNav";
import { ManifestErrorMessage } from "../ManifestErrorMessage/ManifestErrorMessage";

const manifestValidator = new ExtensionManifestValidator();

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
  const intl = useIntl();
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

  const issues = useMemo(() => {
    const manifestValidation = manifestValidator.validateAppManifest(manifest);

    return "issues" in manifestValidation ? manifestValidation.issues : undefined;
  }, [manifest]);

  /**
   * Prevent installation if validation fails. In the future we can change errors to warnings, but first we need to add special handling
   * to Dashboard, e.g. render "warning" near widget that widget is broken.
   */
  const canInstall = !issues && manifest;

  return (
    <>
      <InstallTopNav
        title={intl.formatMessage(headerTitles.addCustomExtensionManifestUrl)}
        showDocsLink={false}
      />
      <Box marginX={6} marginTop={10} display="flex" flexDirection="column" gap={10}>
        <InstallSectionData
          isFetchingManifest={isFetchingManifest}
          manifest={manifest}
          lastFetchedManifestUrl={lastFetchedManifestUrl}
          control={control}
          issues={issues}
        />
        <ManifestErrorMessage error={errors.manifestUrl} />
      </Box>
      <Savebar>
        <Savebar.Spacer />
        <Savebar.CancelButton href={previousPagePath} />
        <Savebar.ConfirmButton
          disabled={!canInstall}
          transitionState={isSubmittingInstallation ? "loading" : "default"}
          onClick={() => submitInstallApp()}
        >
          <FormattedMessage {...messages.install} />
        </Savebar.ConfirmButton>
      </Savebar>
    </>
  );
};
