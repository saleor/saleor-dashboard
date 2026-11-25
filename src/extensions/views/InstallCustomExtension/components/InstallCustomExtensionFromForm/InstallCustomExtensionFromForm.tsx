import { DetailPageLayout } from "@dashboard/components/Layouts/Detail";
import { Savebar } from "@dashboard/components/Savebar";
import { headerTitles, messages } from "@dashboard/extensions/messages";
import { useAutoSubmit } from "@dashboard/utils/hook-form/auto-submit";
import { Box } from "@saleor/macaw-ui-next";
import {
  type Control,
  type UseFormClearErrors,
  type UseFormGetValues,
  type UseFormHandleSubmit,
  type UseFormSetError,
  type UseFormWatch,
} from "react-hook-form";
import { FormattedMessage, useIntl } from "react-intl";

import { previousPagePath } from "../../consts";
import { useFetchManifest } from "../../hooks/useFetchManifest";
import { useInstallApp } from "../../hooks/useInstallApp";
import { useInstallChecks } from "../../hooks/useInstallChecks";
import { type ExtensionInstallFormData } from "../../types";
import { InstallSectionData } from "../InstallSectionData/InstallSectionData";
import { InstallTopNav } from "../InstallTopNav";
import { ManifestUrlForm } from "../ManifestUrlForm/ManifestUrlForm";

export const InstallCustomExtensionFromForm = ({
  control,
  handleSubmit,
  getValues,
  setError,
  clearErrors,
  watch,
}: {
  control: Control<ExtensionInstallFormData>;
  handleSubmit: UseFormHandleSubmit<ExtensionInstallFormData>;
  setError: UseFormSetError<ExtensionInstallFormData>;
  clearErrors: UseFormClearErrors<ExtensionInstallFormData>;
  getValues: UseFormGetValues<ExtensionInstallFormData>;
  watch: UseFormWatch<ExtensionInstallFormData>;
}) => {
  const intl = useIntl();

  const {
    submitFetchManifest,
    manifest,
    lastFetchedManifestUrl,
    isFetchingManifest,
    alreadyInstalledApp,
  } = useFetchManifest({
    getValues,
    setError,
    clearErrors,
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

  const checks = useInstallChecks({ manifest, manifestUrl: lastFetchedManifestUrl });

  return (
    <DetailPageLayout gridTemplateColumns={1}>
      <InstallTopNav title={intl.formatMessage(headerTitles.addCustomExtensionManifest)} />
      <DetailPageLayout.Content>
        <Box marginX={6} marginTop={10} display="flex" flexDirection="column" gap={10}>
          <ManifestUrlForm
            control={control}
            onSubmit={handleSubmit(submitFetchManifest)}
            alreadyInstalledApp={alreadyInstalledApp}
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
            checks={checks}
          />
        </Box>
      </DetailPageLayout.Content>
      <Savebar>
        <Savebar.Spacer />
        <Savebar.CancelButton href={previousPagePath} />
        <Savebar.ConfirmButton
          disabled={!checks.canInstall}
          transitionState={isSubmittingInstallation ? "loading" : "default"}
          onClick={() => submitInstallApp()}
        >
          <FormattedMessage {...messages.install} />
        </Savebar.ConfirmButton>
      </Savebar>
    </DetailPageLayout>
  );
};
