import React from "react";
import { useIntl } from "react-intl";
import { Route, RouteComponentProps, Switch } from "react-router-dom";

import { sectionNames } from "@saleor/intl";
import { WindowTitle } from "@saleor/components/WindowTitle";
import AppDetailsComponent from "./views/AppDetails";
import { appPath } from "./urls";

const AppDetails: React.FC<RouteComponentProps<{ id: string }>> = ({
  match
}) => <AppDetailsComponent id={match.params.id} />;

const Component = () => {
  const intl = useIntl();

  return (
    <>
      <WindowTitle title={intl.formatMessage(sectionNames.apps)} />
      <Switch>
        <Route path={appPath(":id")} component={AppDetails} />
      </Switch>
    </>
  );
};

export default Component;
