import { AppPaths } from "@dashboard/apps/urls";
import SectionRoute from "@dashboard/auth/components/SectionRoute";
import { Route } from "@dashboard/components/Router";
import { WindowTitle } from "@dashboard/components/WindowTitle";
import { ExtensionInstallQueryParams, ExtensionsPaths } from "@dashboard/extensions/urls";
import { ExploreExtensions } from "@dashboard/extensions/views/ExploreExtensions";
import { InstallCustomExtension } from "@dashboard/extensions/views/InstallCustomExtension";
import { InstalledExtensions } from "@dashboard/extensions/views/InstalledExtensions";
import { useFlag } from "@dashboard/featureFlags";
import { PermissionEnum } from "@dashboard/graphql";
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

const InstallCustomExtensionView = () => {
  const qs = parseQs(location.search.substr(1));
  const params: ExtensionInstallQueryParams = qs;

  return <InstallCustomExtension params={params} />;
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
        <SectionRoute
          exact
          permissions={[PermissionEnum.MANAGE_APPS]}
          path={ExtensionsPaths.installCustomExtension}
          component={InstallCustomExtensionView}
        />
        <Route component={NotFound} />
      </Switch>
    </>
  );
};
