import { AppInstallErrorPage } from "@dashboard/apps/components/AppInstallErrorPage";
import AppInstallPage from "@dashboard/apps/components/AppInstallPage";
import { AppInstallUrlQueryParams, AppUrls, MANIFEST_ATTR } from "@dashboard/apps/urls";
import { WindowTitle } from "@dashboard/components/WindowTitle";
import { useAppFetchMutation, useAppInstallMutation } from "@dashboard/graphql";
import useLocalStorage from "@dashboard/hooks/useLocalStorage";
import useNavigator from "@dashboard/hooks/useNavigator";
import useNotifier from "@dashboard/hooks/useNotifier";
import { extractMutationErrors } from "@dashboard/misc";
import getAppErrorMessage from "@dashboard/utils/errors/app";
import React, { useEffect } from "react";
import { useIntl } from "react-intl";
import { RouteComponentProps } from "react-router-dom";

import { messages } from "./messages";

interface Props extends RouteComponentProps {
  params: AppInstallUrlQueryParams;
}

export const AppInstallView: React.FC<Props> = ({ params }) => {
  const [, setActiveInstallations] = useLocalStorage<Array<Record<"id" | "name", string>>>(
    "activeInstallations",
    [],
  );
  const navigate = useNavigator();
  const notify = useNotifier();
  const intl = useIntl();
  const manifestUrl = params[MANIFEST_ATTR];
  const [fetchManifest, fetchManifestOpts] = useAppFetchMutation({
    onCompleted: data => {
      if (data?.appFetchManifest?.errors.length) {
        data.appFetchManifest.errors.forEach(error => {
          notify({
            status: "error",
            text: getAppErrorMessage(error, intl),
          });
        });
      }
    },
  });
  const [installApp] = useAppInstallMutation({
    onCompleted: data => {
      const installationData = data?.appInstall?.appInstallation;

      if (data.appInstall?.errors.length === 0) {
        if (installationData) {
          setActiveInstallations(activeInstallations => [
            ...activeInstallations,
            {
              id: installationData.id,
              name: installationData.appName,
            },
          ]);
        }

        navigateToAppsList();
      } else {
        (data?.appInstall?.errors ?? []).forEach(error => {
          notify({
            status: "error",
            text: getAppErrorMessage(error, intl),
          });
        });
      }
    },
  });
  const navigateToAppsList = () => navigate(AppUrls.resolveAppListUrl());
  const handleSubmit = () => {
    const manifest = fetchManifestOpts?.data?.appFetchManifest?.manifest;

    return extractMutationErrors(
      installApp({
        variables: {
          input: {
            appName: manifest?.name,
            manifestUrl,
            permissions: manifest?.permissions?.map(permission => permission.code),
          },
        },
      }),
    );
  };

  useEffect(() => {
    if (manifestUrl) {
      fetchManifest({ variables: { manifestUrl } });
    } else {
      navigate(AppUrls.resolveAppListUrl());
    }
  }, []);

  return (
    <>
      <WindowTitle title={intl.formatMessage(messages.installApp)} />
      {!!fetchManifestOpts.data?.appFetchManifest?.errors?.length || !!fetchManifestOpts.error ? (
        <AppInstallErrorPage onBack={navigateToAppsList} />
      ) : (
        <AppInstallPage
          data={fetchManifestOpts?.data?.appFetchManifest?.manifest ?? null}
          navigateToAppsList={navigateToAppsList}
          onSubmit={handleSubmit}
          loading={fetchManifestOpts?.loading}
        />
      )}
    </>
  );
};
