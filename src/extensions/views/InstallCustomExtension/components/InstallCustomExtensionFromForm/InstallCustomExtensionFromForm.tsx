import { Savebar } from "@dashboard/components/Savebar";
import { ExtensionManifestValidator } from "@dashboard/extensions/domain/extension-manifest-validator";
import { headerTitles, messages } from "@dashboard/extensions/messages";
import { useAutoSubmit } from "@dashboard/utils/hook-form/auto-submit";
import { Box } from "@saleor/macaw-ui-next";
import { useMemo } from "react";
import {
  Control,
  UseFormGetValues,
  UseFormHandleSubmit,
  UseFormSetError,
  UseFormWatch,
} from "react-hook-form";
import { FormattedMessage, useIntl } from "react-intl";

import { previousPagePath } from "../../consts";
import { useFetchManifest } from "../../hooks/useFetchManifest";
import { useInstallApp } from "../../hooks/useInstallApp";
import { ExtensionInstallFormData } from "../../types";
import { InstallSectionData } from "../InstallSectionData/InstallSectionData";
import { InstallTopNav } from "../InstallTopNav";
import { ManifestUrlForm } from "../ManifestUrlForm/ManifestUrlForm";

const manifestValidator = new ExtensionManifestValidator();

export const InstallCustomExtensionFromForm = ({
  control,
  handleSubmit,
  getValues,
  setError,
  watch,
}: {
  control: Control<ExtensionInstallFormData>;
  handleSubmit: UseFormHandleSubmit<ExtensionInstallFormData>;
  setError: UseFormSetError<ExtensionInstallFormData>;
  getValues: UseFormGetValues<ExtensionInstallFormData>;
  watch: UseFormWatch<ExtensionInstallFormData>;
}) => {
  const intl = useIntl();

  const { submitFetchManifest, manifest, lastFetchedManifestUrl, isFetchingManifest } =
    useFetchManifest({
      getValues,
      setError,
    });

  const { flush: flushDebouncedSubmit } = useAutoSubmit({
    watch,
    onSubmit: handleSubmit(submitFetchManifest),
    control,
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
      <InstallTopNav title={intl.formatMessage(headerTitles.addCustomExtensionManifest)} />
      <Box marginX={6} marginTop={10} display="flex" flexDirection="column" gap={10}>
        <ManifestUrlForm
          control={control}
          onSubmit={handleSubmit(submitFetchManifest)}
          onPaste={() => {
            // On paste immediately submit form
            // Wait for next tick when debounced submit is scheduled and call it immedioately
            setTimeout(() => {
              flushDebouncedSubmit();
            });
          }}
        />
        <InstallSectionData
          isFetchingManifest={isFetchingManifest}
          manifest={manifest}
          lastFetchedManifestUrl={lastFetchedManifestUrl}
          control={control}
          issues={issues}
        />
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
