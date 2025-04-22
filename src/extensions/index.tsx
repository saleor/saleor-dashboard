import { AppPaths } from "@dashboard/apps/urls";
import { AppListView } from "@dashboard/apps/views";
import { Route } from "@dashboard/components/Router";
import { WindowTitle } from "@dashboard/components/WindowTitle";
import { CustomAppDetailsUrlQueryParams } from "@dashboard/custom-apps/urls";
import CustomAppDetailsView from "@dashboard/custom-apps/views/CustomAppDetails";
import { ExtensionsPaths } from "@dashboard/extensions/urls";
import { ExploreExtensions } from "@dashboard/extensions/views/ExploreExtensions";
import { InstalledExtensions } from "@dashboard/extensions/views/InstalledExtensions";
import { useFlag } from "@dashboard/featureFlags";
import useNavigator from "@dashboard/hooks/useNavigator";
import { sectionNames } from "@dashboard/intl";
import { parse as parseQs } from "qs";
import React from "react";
import { useIntl } from "react-intl";
import { RouteComponentProps, Switch } from "react-router-dom";

import { useCustomAppToken } from "./hooks/useCustomAppToken";
import { AddCustomExtension } from "./views/AddCusttomExtension";

const ExploreExtensionsView = () => {
  return <ExploreExtensions />;
};

const InstalledExtensionsView = () => {
  const qs = parseQs(location.search.substr(1));
  const params = qs;
  const { enabled: isExtensionsDevEnabled } = useFlag("extensions_dev");

  if (isExtensionsDevEnabled) {
    return <InstalledExtensions params={params} />;
  }

  return <AppListView params={params} showAvailableApps={false} />;
};

const CustomExtensionDetails = ({
  match,
  token,
  onTokenClose,
}: RouteComponentProps<{ id?: string }> & { token: string; onTokenClose: () => void }) => {
  const qs = parseQs(location.search.substr(1));
  const params: CustomAppDetailsUrlQueryParams = qs;
  const id = match.params.id;

  if (!id) {
    throw new Error("No ID provided");
  }

  return (
    <CustomAppDetailsView
      id={decodeURIComponent(id)}
      params={params}
      token={token}
      onTokenClose={onTokenClose}
    />
  );
};

export const ExtensionsSection = () => {
  const intl = useIntl();
  const navigate = useNavigator();
  const { enabled: isExtensionsEnabled } = useFlag("extensions");

  const { customAppToken, setCustomAppToken } = useCustomAppToken();

  if (!isExtensionsEnabled) {
    navigate(AppPaths.appListPath, { replace: true });

    return <>Redirecting...</>;
  }

  return (
    <>
      <WindowTitle title={intl.formatMessage(sectionNames.extensions)} />
      <Switch>
        <Route exact path={ExtensionsPaths.exploreExtensions} component={ExploreExtensionsView} />
        <Route
          exact
          path={ExtensionsPaths.installedExtensions}
          component={InstalledExtensionsView}
        />
        <Route exact path={ExtensionsPaths.addCustomExtension} component={AddCustomExtension} />

        {/* Custom apps routes */}
        <Route
          exact
          path={ExtensionsPaths.resolveEditCustomExtension(":id")}
          render={props => (
            <CustomExtensionDetails
              {...props}
              token={customAppToken}
              onTokenClose={() => setCustomAppToken(null)}
            />
          )}
        />
      </Switch>
    </>
  );
};
