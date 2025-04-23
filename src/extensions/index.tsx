import { AppPaths } from "@dashboard/apps/urls";
import { Route } from "@dashboard/components/Router";
import { WindowTitle } from "@dashboard/components/WindowTitle";
import { ExtensionsPaths } from "@dashboard/extensions/urls";
import { ExploreExtensions } from "@dashboard/extensions/views/ExploreExtensions";
import { InstalledExtensions } from "@dashboard/extensions/views/InstalledExtensions";
import { useFlag } from "@dashboard/featureFlags";
import useNavigator from "@dashboard/hooks/useNavigator";
import { sectionNames } from "@dashboard/intl";
import NotFound from "@dashboard/NotFound";
import { parse as parseQs } from "qs";
import React from "react";
import { useIntl } from "react-intl";
import { Switch } from "react-router-dom";

const ExploreExtensionsView = () => {
  return <ExploreExtensions />;
};

const InstalledExtensionsView = () => {
  const qs = parseQs(location.search.substr(1));
  const params = qs;

  return <InstalledExtensions params={params} />;
};

export const ExtensionsSection = () => {
  const intl = useIntl();
  const navigate = useNavigator();
  const { enabled: isExtensionsEnabled } = useFlag("extensions");

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
        <Route component={NotFound} />
      </Switch>
    </>
  );
};
