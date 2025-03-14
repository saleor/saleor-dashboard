import { Route } from "@dashboard/components/Router";
import { WindowTitle } from "@dashboard/components/WindowTitle";
import { exploreExtensionsPath, installedExtensionsPath } from "@dashboard/extensions/urls";
import { sectionNames } from "@dashboard/intl";
import React from "react";
import { useIntl } from "react-intl";
import { Switch } from "react-router-dom";

const ExploreExtensions = () => {
  return (
    <div>
      <h1>Explore Extensions</h1>
    </div>
  );
};

const InstalledExtensions = () => {
  return (
    <div>
      <h1>Installed Extensions</h1>
    </div>
  );
};

export const ExtensionsSection = () => {
  const intl = useIntl();

  return (
    <>
      <WindowTitle title={intl.formatMessage(sectionNames.extensions)} />
      <Switch>
        <Route exact path={exploreExtensionsPath} component={ExploreExtensions} />
        <Route exact path={installedExtensionsPath} component={InstalledExtensions} />
      </Switch>
    </>
  );
};
