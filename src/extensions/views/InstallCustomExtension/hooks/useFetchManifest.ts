import { findAlreadyInstalledApp } from "@dashboard/extensions/utils/findInstalledAppByIdentifier";
import {
  resolveAlreadyInstalledAppLinkTarget,
  resolveInstalledAppHref,
} from "@dashboard/extensions/utils/resolveInstalledAppHref";
import {
  AppErrorCode,
  type InstalledAppFragment,
  useAppFetchMutation,
  useInstalledAppsQuery,
} from "@dashboard/graphql";
import { errorTracker } from "@dashboard/services/errorTracking";
import { mapEdgesToItems } from "@dashboard/utils/maps";
import { useCallback, useEffect, useState } from "react";
import {
  type SubmitHandler,
  type UseFormClearErrors,
  type UseFormGetValues,
  type UseFormSetError,
} from "react-hook-form";

import { type ExtensionInstallFormData, type Manifest } from "../types";

export type AlreadyInstalledApp = {
  name: string;
  href: string;
  isActive: boolean | null;
  linkTarget: "app" | "settings";
};

type PendingUniqueResolution = {
  manifestUrl: string;
  identifier: string | null;
  uniqueError: {
    field?: string | null;
    message?: string | null;
  };
};

const toAlreadyInstalledApp = (app: InstalledAppFragment): AlreadyInstalledApp => ({
  name: app.name ?? app.identifier ?? "Extension",
  href: resolveInstalledAppHref({
    id: app.id,
    type: app.type,
    isActive: app.isActive,
    appUrl: app.appUrl,
  }),
  isActive: app.isActive,
  linkTarget: resolveAlreadyInstalledAppLinkTarget({
    type: app.type,
    isActive: app.isActive,
    appUrl: app.appUrl,
  }),
});

export const useFetchManifest = ({
  getValues,
  setError,
  clearErrors,
}: {
  getValues: UseFormGetValues<ExtensionInstallFormData>;
  setError: UseFormSetError<ExtensionInstallFormData>;
  clearErrors: UseFormClearErrors<ExtensionInstallFormData>;
}) => {
  const [alreadyInstalledApp, setAlreadyInstalledApp] = useState<AlreadyInstalledApp | null>(null);
  const [pendingUniqueResolution, setPendingUniqueResolution] =
    useState<PendingUniqueResolution | null>(null);
  const { data: installedAppsData, loading: installedAppsLoading } = useInstalledAppsQuery({
    variables: {
      first: 100,
    },
  });
  const installedApps = mapEdgesToItems(installedAppsData?.apps) ?? [];

  // TODO: Remove this once updated to newer Apollo version
  // In latest apollo we can call fetchManifestOpts.reset to clear data
  const [lastFetchedManifestUrl, setLastFetchedManifestUrl] = useState<string>();

  const setUniqueInstallError = useCallback(() => {
    setAlreadyInstalledApp(null);
    setPendingUniqueResolution(null);
    setError("manifestUrl", {
      type: AppErrorCode.UNIQUE,
      message: "The extension identifier is already in use.",
    });
  }, [setError]);

  const resolveUniqueInstall = useCallback(
    ({
      manifestUrl,
      identifierFromManifest,
      uniqueError,
    }: {
      manifestUrl: string;
      identifierFromManifest?: string | null;
      uniqueError: PendingUniqueResolution["uniqueError"];
    }) => {
      if (installedAppsLoading) {
        setPendingUniqueResolution({
          manifestUrl,
          identifier: identifierFromManifest ?? null,
          uniqueError,
        });

        return;
      }

      const existingApp = findAlreadyInstalledApp(installedApps, {
        identifier: identifierFromManifest,
        manifestUrl,
        uniqueError,
      });

      if (existingApp) {
        clearErrors("manifestUrl");
        setAlreadyInstalledApp(toAlreadyInstalledApp(existingApp));
        setPendingUniqueResolution(null);

        return;
      }

      setUniqueInstallError();
    },
    [clearErrors, installedApps, installedAppsLoading, setUniqueInstallError],
  );

  const [fetchManifest, fetchManifestOpts] = useAppFetchMutation({
    // We disable default error handling to avoid showing popups on each change in input
    // as it can accumulate in a lot of notifications
    disableErrorHandling: true,
    onCompleted: data => {
      setLastFetchedManifestUrl(getValues("manifestUrl"));

      const firstError = data?.appFetchManifest?.errors?.[0];

      if (firstError) {
        const manifestUrl = getValues("manifestUrl");

        if (firstError.code === AppErrorCode.UNIQUE && manifestUrl) {
          resolveUniqueInstall({
            manifestUrl,
            identifierFromManifest: data?.appFetchManifest?.manifest?.identifier,
            uniqueError: {
              field: firstError.field,
              message: firstError.message,
            },
          });

          return;
        }

        setPendingUniqueResolution(null);
        setAlreadyInstalledApp(null);

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
        setPendingUniqueResolution(null);
        setAlreadyInstalledApp(null);

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
      } else {
        setPendingUniqueResolution(null);
        setAlreadyInstalledApp(null);
      }
    },
  });

  useEffect(
    function resolveAlreadyInstalledAfterAppsLoad() {
      if (!pendingUniqueResolution || installedAppsLoading) {
        return;
      }

      resolveUniqueInstall({
        manifestUrl: pendingUniqueResolution.manifestUrl,
        identifierFromManifest: pendingUniqueResolution.identifier,
        uniqueError: pendingUniqueResolution.uniqueError,
      });
    },
    [installedAppsLoading, pendingUniqueResolution, resolveUniqueInstall],
  );

  const submitFetchManifest: SubmitHandler<ExtensionInstallFormData> = data => {
    setAlreadyInstalledApp(null);
    setPendingUniqueResolution(null);
    fetchManifest({ variables: data });
  };

  const manifest = fetchManifestOpts?.data?.appFetchManifest?.manifest as Manifest;

  return {
    manifest,
    submitFetchManifest,
    lastFetchedManifestUrl,
    isFetchingManifest: fetchManifestOpts.loading,
    alreadyInstalledApp,
  } as const;
};
