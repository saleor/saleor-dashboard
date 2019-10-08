import { parse as parseQs } from "qs";
import React from "react";
import { useIntl } from "react-intl";
import { Route, RouteComponentProps, Switch } from "react-router-dom";

import { sectionNames } from "@saleor/intl";
import { WindowTitle } from "../components/WindowTitle";
import {
  serviceAddPath,
  serviceListPath,
  ServiceListUrlQueryParams,
  servicePath,
  ServiceUrlQueryParams
} from "./urls";
import ServiceCreate from "./views/ServiceCreate";
import ServiceDetailsComponent from "./views/ServiceDetails";
import ServiceListComponent from "./views/ServiceList";

const ServiceList: React.FC<RouteComponentProps> = ({ location }) => {
  const qs = parseQs(location.search.substr(1));
  const params: ServiceListUrlQueryParams = qs;

  return <ServiceListComponent params={params} />;
};

interface ServiceDetailsProps extends RouteComponentProps<{ id: string }> {
  token: string;
  onTokenClose: () => void;
}
const ServiceDetails: React.FC<ServiceDetailsProps> = ({
  match,
  token,
  onTokenClose
}) => {
  const qs = parseQs(location.search.substr(1));
  const params: ServiceUrlQueryParams = qs;

  return (
    <ServiceDetailsComponent
      id={decodeURIComponent(match.params.id)}
      params={params}
      token={token}
      onTokenClose={onTokenClose}
    />
  );
};

const ServiceSection = () => {
  const intl = useIntl();
  const [token, setToken] = React.useState<string>(null);

  return (
    <>
      <WindowTitle title={intl.formatMessage(sectionNames.serviceAccounts)} />
      <Switch>
        <Route exact path={serviceListPath} component={ServiceList} />
        <Route
          exact
          path={serviceAddPath}
          render={() => <ServiceCreate setToken={setToken} />}
        />
        <Route
          path={servicePath(":id")}
          render={props => (
            <ServiceDetails
              {...props}
              token={token}
              onTokenClose={() => setToken(null)}
            />
          )}
        />
      </Switch>
    </>
  );
};

export default ServiceSection;
