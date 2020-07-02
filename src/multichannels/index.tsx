import { sectionNames } from "@saleor/intl";
import React from "react";
import { useIntl } from "react-intl";
import { Route, Switch } from "react-router-dom";

import { WindowTitle } from "../components/WindowTitle";
import { multichannelsListPath } from "./urls";
import MultichannelsListView from "./views/MultichannelsList";

export const MultichannelsSection: React.FC<{}> = () => {
  const intl = useIntl();

  return (
    <>
      <WindowTitle title={intl.formatMessage(sectionNames.channels)} />
      <Switch>
        <Route
          exact
          path={multichannelsListPath}
          component={MultichannelsListView}
        />
      </Switch>
    </>
  );
};
export default MultichannelsSection;
