import { Route } from "@dashboard/components/Router";
import { sectionNames } from "@dashboard/intl";
import { parseQs } from "@dashboard/url-utils";
import { useIntl } from "react-intl";
import { RouteComponentProps, Switch } from "react-router-dom";

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

const TaxChannelsList = ({ match, location }: RouteComponentProps<{ id: string }>) => {
  const qs: TaxesUrlQueryParams = parseQs(location.search.substring(1));

  return <TaxChannelsListComponent id={decodeURIComponent(match.params.id)} params={qs} />;
};
const TaxCountriesList = ({ match }: RouteComponentProps<{ id: string }>) => {
  const qs: TaxesUrlQueryParams = parseQs(location.search.substring(1));

  return <TaxCountriesListComponent id={decodeURIComponent(match.params.id)} params={qs} />;
};
const TaxClassesList = ({ match }: RouteComponentProps<{ id: string }>) => (
  <TaxClassesListComponent id={decodeURIComponent(match.params.id)} />
);
const Component = () => {
  const intl = useIntl();

  return (
    <>
      <WindowTitle title={intl.formatMessage(sectionNames.taxes)} />
      <Switch>
        <Route path={taxConfigurationListPath(":id")} component={TaxChannelsList} />
        <Route path={taxConfigurationListPath()} component={TaxChannelsList} />
        <Route path={taxCountriesListPath(":id")} component={TaxCountriesList} />
        <Route path={taxCountriesListPath()} component={TaxCountriesList} />
        <Route path={taxClassesListUrl(":id")} component={TaxClassesList} />
        <Route path={taxClassesListUrl()} component={TaxClassesList} />
      </Switch>
    </>
  );
};

export default Component;
