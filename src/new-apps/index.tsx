import { sectionNames } from "@saleor/intl";
import React from "react";
import { useIntl } from "react-intl";
import { Route, Switch } from "react-router-dom";

import { WindowTitle } from "../components/WindowTitle";
import { AppPaths } from "./urls";
import AppListView from "./views/AppList";

const Apps = () => {
  const intl = useIntl();

  return (
    <>
      <WindowTitle title={intl.formatMessage(sectionNames.apps)} />
      <Switch>
        <Route exact path={AppPaths.appListPath} component={AppListView} />
      </Switch>
    </>
  );
};

export default Apps;
