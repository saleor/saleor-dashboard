import React from "react";
import { useIntl } from "react-intl";
import { Route, RouteComponentProps, Switch } from "react-router-dom";

import { sectionNames } from "@saleor/intl";
import { WindowTitle } from "@saleor/components/WindowTitle";
import ExtensionDetailsComponent from "./views/ExtensionDetails";
import { extensionPath } from "./urls";

const ExtensionDetails: React.FC<RouteComponentProps<{ id: string }>> = ({
  match
}) => <ExtensionDetailsComponent id={match.params.id} />;

const Component = () => {
  const intl = useIntl();

  return (
    <>
      <WindowTitle title={intl.formatMessage(sectionNames.extensions)} />
      <Switch>
        <Route path={extensionPath(":id")} component={ExtensionDetails} />
      </Switch>
    </>
  );
};

export default Component;
