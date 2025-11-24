import { ConditionalCustomerFilterProvider } from "@dashboard/components/ConditionalFilter";
import { Route } from "@dashboard/components/Router";
import { sectionNames } from "@dashboard/intl";
import { parseQs } from "@dashboard/url-utils";
import { asSortParams } from "@dashboard/utils/sort";
import { useIntl } from "react-intl";
import { RouteComponentProps, Switch } from "react-router-dom";

import { WindowTitle } from "../components/WindowTitle";
import {
  customerAddPath,
  customerAddressesPath,
  CustomerAddressesUrlQueryParams,
  customerListPath,
  CustomerListUrlQueryParams,
  CustomerListUrlSortField,
  customerPath,
  CustomerUrlQueryParams,
} from "./urls";
import CustomerAddressesViewComponent from "./views/CustomerAddresses";
import CustomerCreateView from "./views/CustomerCreate";
import CustomerDetailsViewComponent from "./views/CustomerDetails";
import CustomerListViewComponent from "./views/CustomerList";

const CustomerListView = () => {
  const qs = parseQs(location.search.substr(1)) as any;
  const params: CustomerListUrlQueryParams = asSortParams(qs, CustomerListUrlSortField);

  return (
    <ConditionalCustomerFilterProvider locationSearch={location.search}>
      <CustomerListViewComponent params={params} />
    </ConditionalCustomerFilterProvider>
  );
};

interface CustomerDetailsRouteParams {
  id: string;
}

const CustomerDetailsView = ({
  location,
  match,
}: RouteComponentProps<CustomerDetailsRouteParams>) => {
  const qs = parseQs(location.search.substr(1));
  const params: CustomerUrlQueryParams = qs;

  return <CustomerDetailsViewComponent id={decodeURIComponent(match.params.id)} params={params} />;
};

interface CustomerAddressesRouteParams {
  id: string;
}

const CustomerAddressesView = ({ match }: RouteComponentProps<CustomerAddressesRouteParams>) => {
  const qs = parseQs(location.search.substr(1));
  const params: CustomerAddressesUrlQueryParams = qs;

  return (
    <CustomerAddressesViewComponent id={decodeURIComponent(match.params.id)} params={params} />
  );
};

export const CustomerSection = () => {
  const intl = useIntl();

  return (
    <>
      <WindowTitle title={intl.formatMessage(sectionNames.customers)} />
      <Switch>
        <Route exact path={customerListPath} component={CustomerListView} />
        <Route exact path={customerAddPath} component={CustomerCreateView} />
        <Route path={customerAddressesPath(":id")} component={CustomerAddressesView} />
        <Route path={customerPath(":id")} component={CustomerDetailsView} />
      </Switch>
    </>
  );
};
