import { sectionNames } from "@saleor/intl";
import { appsListPath } from "@saleor/new-apps/urls";
import React from "react";
import { useIntl } from "react-intl";
import { Route, RouteComponentProps, Switch } from "react-router-dom";

import { WindowTitle } from "../components/WindowTitle";
import AppsListView from "./views/AppsList";

const AppsList: React.FC<RouteComponentProps> = () => <AppsListView />;

const Apps = () => {
  const intl = useIntl();

  return (
    <>
      <WindowTitle title={intl.formatMessage(sectionNames.apps)} />
      <Switch>
        <Route exact path={appsListPath} component={AppsList} />
      </Switch>
    </>
  );
};

export default Apps;
