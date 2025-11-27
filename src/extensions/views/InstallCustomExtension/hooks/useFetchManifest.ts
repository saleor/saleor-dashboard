import { AppErrorCode, useAppFetchMutation } from "@dashboard/graphql";
import { errorTracker } from "@dashboard/services/errorTracking";
import { useState } from "react";
import { SubmitHandler, UseFormGetValues, UseFormSetError } from "react-hook-form";

import { ExtensionInstallFormData, Manifest } from "../types";

export const useFetchManifest = ({
  getValues,
  setError,
}: {
  getValues: UseFormGetValues<ExtensionInstallFormData>;
  setError: UseFormSetError<ExtensionInstallFormData>;
}) => {
  // TODO: Remove this once updated to newer Apollo version
  // In latest apollo we can call fetchManifestOpts.reset to clear data
  const [lastFetchedManifestUrl, setLastFetchedManifestUrl] = useState<string>();

  const [fetchManifest, fetchManifestOpts] = useAppFetchMutation({
    // We disable default error handling to avoid showing popups on each change in input
    // as it can accumulate in a lot of notifications
    disableErrorHandling: true,
    onCompleted: data => {
      setLastFetchedManifestUrl(getValues("manifestUrl"));

      const firstError = data?.appFetchManifest?.errors?.[0];

      if (firstError) {
        // Use the AppErrorCode from the backend error as the 'type' field for react-hook-form.
        // We will use 'type' (AppErrorCode) to render the rich message with link to docs
        setError("manifestUrl", {
          type: firstError.code,
          message: firstError.message || "Failed to fetch manifest details.",
        });
      } else if (
        data?.appFetchManifest?.manifest === null &&
        !data?.appFetchManifest?.errors.length
      ) {
        // This is an edge case and shouldn't happen
        setError("manifestUrl", {
          type: AppErrorCode.GRAPHQL_ERROR,
          message: "Manifest URL is valid but manifest is empty or invalid.",
        });

        errorTracker.captureException(
          new Error(
            `Manifest data was empty, but no errors were returned from Saleor for manifestUrl: ${getValues("manifestUrl")}`,
          ),
        );
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
