import { sectionNames } from "@saleor/intl";
import { parse as parseQs } from "qs";
import React from "react";
import { useIntl } from "react-intl";
import { Route, RouteComponentProps, Switch } from "react-router-dom";

import { WindowTitle } from "../components/WindowTitle";
import {
  taxClassesListUrl,
  taxConfigurationListPath,
  taxCountriesListPath,
  TaxesUrlQueryParams,
} from "./urls";
import ChannelsListComponent from "./views/ChannelsList";
import CountriesListComponent from "./views/CountriesList";
import TaxClassesListComponent from "./views/TaxClassesList";

const ChannelsList: React.FC<RouteComponentProps<{ id: string }>> = ({
  match,
  location,
}) => {
  const qs: TaxesUrlQueryParams = parseQs(location.search.substring(1));

  return (
    <ChannelsListComponent
      id={decodeURIComponent(match.params.id)}
      params={qs}
    />
  );
};

const CountriesList: React.FC<RouteComponentProps<{ id: string }>> = ({
  match,
}) => {
  const qs: TaxesUrlQueryParams = parseQs(location.search.substring(1));

  return (
    <CountriesListComponent
      id={decodeURIComponent(match.params.id)}
      params={qs}
    />
  );
};

const TaxClassesList: React.FC<RouteComponentProps<{ id: string }>> = ({
  match,
}) => <TaxClassesListComponent id={decodeURIComponent(match.params.id)} />;

const Component = () => {
  const intl = useIntl();

  return (
    <>
      <WindowTitle title={intl.formatMessage(sectionNames.taxes)} />
      <Switch>
        <Route
          path={taxConfigurationListPath(":id")}
          component={ChannelsList}
        />
        <Route path={taxConfigurationListPath()} component={ChannelsList} />
        <Route path={taxCountriesListPath(":id")} component={CountriesList} />
        <Route path={taxCountriesListPath()} component={CountriesList} />
        <Route path={taxClassesListUrl(":id")} component={TaxClassesList} />
        <Route path={taxClassesListUrl()} component={TaxClassesList} />
      </Switch>
    </>
  );
};

export default Component;
