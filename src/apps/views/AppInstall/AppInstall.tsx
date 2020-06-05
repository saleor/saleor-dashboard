import { WindowTitle } from "@saleor/components/WindowTitle";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import React, { useEffect } from "react";
import { useIntl } from "react-intl";
import { RouteComponentProps } from "react-router-dom";

import AppInstallPage from "../../components/AppInstallPage";
import {
  useAppInstallMutation,
  useAppManifestFetchMutation
} from "../../mutations";
import {
  AppInstallUrlQueryParams,
  appsListUrl,
  MANIFEST_ATTR
} from "../../urls";

interface InstallAppCreateProps extends RouteComponentProps {
  params: AppInstallUrlQueryParams;
}
export const InstallAppCreate: React.FC<InstallAppCreateProps> = ({
  params
}) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const intl = useIntl();
  const manifestUrl = params[MANIFEST_ATTR];

  const [fetchManifest, fetchManifestOpts] = useAppManifestFetchMutation({
    onCompleted: data => {
      if (data.appFetchManifest.errors.length) {
        notify({
          text: intl.formatMessage({ defaultMessage: "Error" })
        });
      }
    }
  });

  const [installApp] = useAppInstallMutation({
    onCompleted: data => {
      if (data.appInstall.errors.length === 0) {
        navigateToAppsList();
      } else {
        data.appInstall.errors.forEach(error => {
          notify({
            text: error.message
          });
        });
      }
    }
  });

  const navigateToAppsList = () => navigate(appsListUrl());

  const handleSubmit = () => {
    installApp({
      variables: {
        input: {
          appName: fetchManifestOpts?.data?.appFetchManifest?.manifest?.name,
          manifestUrl,
          permissions: fetchManifestOpts?.data?.appFetchManifest?.manifest?.permissions.map(
            permission => permission.code
          )
        }
      }
    });
  };

  useEffect(() => {
    if (manifestUrl) {
      fetchManifest({ variables: { manifestUrl } });
    }
  }, []);

  return (
    <>
      <WindowTitle
        title={intl.formatMessage({
          defaultMessage: "Install App",
          description: "window title"
        })}
      />
      <AppInstallPage
        data={fetchManifestOpts?.data}
        navigateToAppsList={navigateToAppsList}
        loading={false}
        onSubmit={handleSubmit}
      />
    </>
  );
};

export default InstallAppCreate;
