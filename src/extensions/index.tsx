import React from "react";
import { parse as parseQs } from "qs";
import { useIntl } from "react-intl";
import { Route, RouteComponentProps, Switch } from "react-router-dom";

import { sectionNames } from "@saleor/intl";
import { WindowTitle } from "@saleor/components/WindowTitle";
import ExtensionDetailsComponent from "./views/ExtensionDetails";
import ExtensionListComponent from "./views/ExtensionList";
import {
  extensionPath,
  extensionListPath,
  ExtensionListUrlQueryParams
} from "./urls";

const ExtensionList: React.FC<RouteComponentProps> = ({ location }) => {
  const qs: ExtensionListUrlQueryParams = parseQs(location.search.substr(1));
  return <ExtensionListComponent params={qs} />;
};

const ExtensionDetails: React.FC<RouteComponentProps<{ id: string }>> = ({
  match
}) => <ExtensionDetailsComponent id={match.params.id} />;

const Component = () => {
  const intl = useIntl();

  return (
    <>
      <WindowTitle title={intl.formatMessage(sectionNames.extensions)} />
      <Switch>
        <Route exact path={extensionListPath} component={ExtensionList} />
        <Route path={extensionPath(":id")} component={ExtensionDetails} />
      </Switch>
    </>
  );
};

export default Component;
