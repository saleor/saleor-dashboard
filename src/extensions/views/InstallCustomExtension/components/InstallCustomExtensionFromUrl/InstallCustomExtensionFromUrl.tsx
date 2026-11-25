import { DetailPageLayout } from "@dashboard/components/Layouts/Detail";
import { Savebar } from "@dashboard/components/Savebar";
import { headerTitles, messages } from "@dashboard/extensions/messages";
import { type ExtensionInstallQueryParams } from "@dashboard/extensions/urls";
import { Box } from "@saleor/macaw-ui-next";
import {
  type Control,
  type UseFormClearErrors,
  type UseFormGetValues,
  type UseFormHandleSubmit,
  type UseFormSetError,
  useFormState,
  type UseFormTrigger,
} from "react-hook-form";
import { FormattedMessage, useIntl } from "react-intl";

import { previousPagePath } from "../../consts";
import { useFetchManifest } from "../../hooks/useFetchManifest";
import { useInstallApp } from "../../hooks/useInstallApp";
import { useInstallChecks } from "../../hooks/useInstallChecks";
import { useLoadQueryParamsToForm } from "../../hooks/useLoadQueryParamsToForm";
import { type ExtensionInstallFormData } from "../../types";
import { InstallSectionData } from "../InstallSectionData/InstallSectionData";
import { InstallTopNav } from "../InstallTopNav";
import { ManifestErrorMessage } from "../ManifestErrorMessage/ManifestErrorMessage";

export const InstallCustomExtensionFromUrl = ({
  trigger,
  control,
  handleSubmit,
  getValues,
  setError,
  clearErrors,
  params,
}: {
  control: Control<ExtensionInstallFormData>;
  trigger: UseFormTrigger<ExtensionInstallFormData>;
  handleSubmit: UseFormHandleSubmit<ExtensionInstallFormData>;
  setError: UseFormSetError<ExtensionInstallFormData>;
  clearErrors: UseFormClearErrors<ExtensionInstallFormData>;
  getValues: UseFormGetValues<ExtensionInstallFormData>;
  params: ExtensionInstallQueryParams;
}) => {
  const intl = useIntl();
  const { errors } = useFormState({ control });

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

  useLoadQueryParamsToForm({
    trigger,
    onSubmit: handleSubmit(submitFetchManifest),
    params,
  });

  const { submitInstallApp, isSubmittingInstallation } = useInstallApp({
    getValues,
    manifest,
  });

  const checks = useInstallChecks({ manifest, manifestUrl: lastFetchedManifestUrl });

  return (
    <DetailPageLayout gridTemplateColumns={1}>
      <InstallTopNav
        title={intl.formatMessage(headerTitles.addCustomExtensionManifestUrl)}
        showDocsLink={false}
      />
      <DetailPageLayout.Content>
        <Box marginX={6} marginTop={10} display="flex" flexDirection="column" gap={10}>
          <InstallSectionData
            isFetchingManifest={isFetchingManifest}
            manifest={manifest}
            lastFetchedManifestUrl={lastFetchedManifestUrl}
            control={control}
            checks={checks}
          />
          <ManifestErrorMessage
            error={alreadyInstalledApp ? undefined : errors.manifestUrl}
            alreadyInstalledApp={alreadyInstalledApp}
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
