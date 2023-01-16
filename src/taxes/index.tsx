import { sectionNames } from "@dashboard/intl";
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
import TaxChannelsListComponent from "./views/TaxChannelsList";
import TaxClassesListComponent from "./views/TaxClassesList";
import TaxCountriesListComponent from "./views/TaxCountriesList";

const TaxChannelsList: React.FC<RouteComponentProps<{ id: string }>> = ({
  match,
  location,
}) => {
  const qs: TaxesUrlQueryParams = parseQs(location.search.substring(1));

  return (
    <TaxChannelsListComponent
      id={decodeURIComponent(match.params.id)}
      params={qs}
    />
  );
};

const TaxCountriesList: React.FC<RouteComponentProps<{ id: string }>> = ({
  match,
}) => {
  const qs: TaxesUrlQueryParams = parseQs(location.search.substring(1));

  return (
    <TaxCountriesListComponent
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
          component={TaxChannelsList}
        />
        <Route path={taxConfigurationListPath()} component={TaxChannelsList} />
        <Route
          path={taxCountriesListPath(":id")}
          component={TaxCountriesList}
        />
        <Route path={taxCountriesListPath()} component={TaxCountriesList} />
        <Route path={taxClassesListUrl(":id")} component={TaxClassesList} />
        <Route path={taxClassesListUrl()} component={TaxClassesList} />
      </Switch>
    </>
  );
};

export default Component;
