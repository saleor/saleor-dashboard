import { parse as parseQs } from "qs";
import React from "react";
import { useIntl } from "react-intl";
import { Route, RouteComponentProps, Switch } from "react-router-dom";

import { sectionNames } from "@saleor/intl";
import { WindowTitle } from "../components/WindowTitle";
import {
  serviceListPath,
  ServiceListUrlQueryParams
  //   servicePath
} from "./urls";
// import ServiceDetailsComponent from "./views/ServiceDetails";
import ServiceListComponent from "./views/ServiceList";

const PluginList: React.StatelessComponent<RouteComponentProps<any>> = ({
  location
}) => {
  const qs = parseQs(location.search.substr(1));
  const params: ServiceListUrlQueryParams = qs;
  return <ServiceListComponent params={params} />;
};

// const ServiceDetails: React.StatelessComponent<RouteComponentProps<any>> = ({
//   match
// }) => {
//   const qs = parseQs(location.search.substr(1));
//   const params: ServiceListUrlQueryParams = qs;

//   return (
//     <ServiceDetailsComponent
//       id={decodeURIComponent(match.params.id)}
//       params={params}
//     />
//   );
// };

const Component = () => {
  const intl = useIntl();
  return (
    <>
      <WindowTitle title={intl.formatMessage(sectionNames.serviceAccounts)} />
      <Switch>
        <Route exact path={serviceListPath} component={PluginList} />
        {/* <Route path={servicePath(":id")} component={ServiceDetails} /> */}
      </Switch>
    </>
  );
};

export default Component;
