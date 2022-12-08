import { sectionNames } from "@saleor/intl";
import { appListPath } from "@saleor/new-apps/urls";
import React from "react";
import { useIntl } from "react-intl";
import { Route, Switch } from "react-router-dom";

import { WindowTitle } from "../components/WindowTitle";
import AppListView from "./views/AppList";

const Apps = () => {
  const intl = useIntl();

  return (
    <>
      <WindowTitle title={intl.formatMessage(sectionNames.apps)} />
      <Switch>
        <Route exact path={appListPath} component={AppListView} />
      </Switch>
    </>
  );
};

export default Apps;
