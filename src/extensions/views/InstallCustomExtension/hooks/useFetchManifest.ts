import { getAppInstallErrorMessage } from "@dashboard/extensions/utils";
import { useAppFetchMutation } from "@dashboard/graphql";
import { useState } from "react";
import { SubmitHandler, UseFormGetValues, UseFormSetError } from "react-hook-form";
import { useIntl } from "react-intl";

import { ExtensionInstallFormData, Manifest } from "../types";

export const useFetchManifest = ({
  getValues,
  setError,
}: {
  getValues: UseFormGetValues<ExtensionInstallFormData>;
  setError: UseFormSetError<ExtensionInstallFormData>;
}) => {
  const intl = useIntl();

  // TODO: Remove this once updated to newer Apollo version
  // In latest apollo we can call fetchManifestOpts.reset to clear data
  const [lastFetchedManifestUrl, setLastFetchedManifestUrl] = useState<string>();

  const [fetchManifest, fetchManifestOpts] = useAppFetchMutation({
    // We disable default error handling to avoid showing popups on each change in input
    // as it can accumulate in a lot of notifications
    disableErrorHandling: true,
    onCompleted: data => {
      setLastFetchedManifestUrl(getValues("manifestUrl"));

      if (data?.appFetchManifest?.errors.length) {
        const mergedErrorMessages = data.appFetchManifest.errors
          .map(error => getAppInstallErrorMessage(error, intl))
          .join(", ");

        setError("manifestUrl", {
          message: mergedErrorMessages,
          type: "validate",
        });
      }
    },
  });

  const submitFetchManifest: SubmitHandler<ExtensionInstallFormData> = data => {
    fetchManifest({ variables: data });
  };

  const manifest = fetchManifestOpts?.data?.appFetchManifest?.manifest as Manifest;

  return {
    manifest,
    submitFetchManifest,
    lastFetchedManifestUrl,
    isFetchingManifest: fetchManifestOpts.loading,
  } as const;
};
