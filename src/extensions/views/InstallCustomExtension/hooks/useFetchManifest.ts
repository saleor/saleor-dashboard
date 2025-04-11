import { getAppInstallErrorMessage } from "@dashboard/extensions/messages";
import { useAppFetchMutation } from "@dashboard/graphql";
import { useState } from "react";
import { SubmitHandler, UseFormGetValues, UseFormSetError } from "react-hook-form";
import { useIntl } from "react-intl";

import { ExtensionInstallFormData } from "../types";

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

  const manifest = fetchManifestOpts?.data?.appFetchManifest?.manifest;

  return {
    manifest,
    submitFetchManifest,
    lastFetchedManifestUrl,
  };
};
