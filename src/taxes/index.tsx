import { sectionNames } from "@saleor/intl";
import React from "react";
import { useIntl } from "react-intl";
import { Route, RouteComponentProps, Switch } from "react-router-dom";

import { WindowTitle } from "../components/WindowTitle";
import { channelsListUrl, countriesListUrl, taxClassesListUrl } from "./urls";
import ChannelsListComponent from "./views/ChannelsList";
import CountriesListComponent from "./views/CountriesList";
import TaxClassesListComponent from "./views/TaxClassesList";

const ChannelsList: React.FC<RouteComponentProps<{ id: string }>> = ({
  match
}) => <ChannelsListComponent id={decodeURIComponent(match.params.id)} />;

const CountriesList: React.FC<RouteComponentProps<{ id: string }>> = ({
  match
}) => <CountriesListComponent id={decodeURIComponent(match.params.id)} />;

const TaxClassesList: React.FC<RouteComponentProps<{ id: string }>> = ({
  match
}) => <TaxClassesListComponent id={decodeURIComponent(match.params.id)} />;

const Component = () => {
  const intl = useIntl();

  return (
    <>
      <WindowTitle title={intl.formatMessage(sectionNames.taxes)} />
      <Switch>
        <Route path={channelsListUrl(":id")} component={ChannelsList} />
        <Route path={channelsListUrl()} component={ChannelsList} />
        <Route path={countriesListUrl(":id")} component={CountriesList} />
        <Route path={countriesListUrl()} component={CountriesList} />
        <Route path={taxClassesListUrl(":id")} component={TaxClassesList} />
        <Route path={taxClassesListUrl()} component={TaxClassesList} />
      </Switch>
    </>
  );
};

export default Component;
