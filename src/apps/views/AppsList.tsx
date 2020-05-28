import { parse as parseQs } from "qs";
import React, { useEffect } from "react";
import { RouteComponentProps } from "react-router-dom";

import AppsListPage from "../components/AppsListPage";
import {
  useAppInstallMutation,
  useAppManifestFetchMutation
} from "../mutations";
import { useInstalledAppsListQuery } from "../queries";

const MANIFEST_ATTR = "manifestUrl";

export const AppsList: React.FC<RouteComponentProps<{}>> = ({
  history,
  location
}) => {
  const qs = parseQs(location.search.substr(1));

  const [fetchManifest, fetchManifestResult] = useAppManifestFetchMutation({});
  const [installApp, installAppResult] = useAppInstallMutation({});

  useEffect(() => {
    const manifestUrl = qs[MANIFEST_ATTR];
    if (manifestUrl) {
      fetchManifest({ variables: { manifestUrl } });
    }
  }, []);

  useEffect(() => {
    const manifestUrl = qs[MANIFEST_ATTR];
    const { data, status } = fetchManifestResult;
    if (manifestUrl && data && status === "success") {
      const {
        data: {
          appFetchManifest: { manifest }
        }
      } = fetchManifestResult;
      if (manifest) {
        installApp({
          variables: {
            input: {
              appName: manifest.name,
              manifestUrl,
              permissions: manifest.permissions.map(
                permission => permission.code
              )
            }
          }
        });
      }
      history.replace(history.location.pathname);
    }
  }, [fetchManifestResult.status]);

  const { data } = useInstalledAppsListQuery({ variables: { first: 20 } });

  return (
    <AppsListPage
      appsList={data}
      appsListInProgress={installAppResult?.data}
      params={qs}
    />
  );
};

export default AppsList;
