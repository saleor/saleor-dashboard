import { Route } from "@dashboard/components/Router";
import { sectionNames } from "@dashboard/intl";
import { parseQs } from "@dashboard/url-utils";
import { asSortParams } from "@dashboard/utils/sort";
import type * as React from "react";
import { useIntl } from "react-intl";
import { Redirect, type RouteComponentProps, Switch } from "react-router-dom";

import { WindowTitle } from "../components/WindowTitle";
import {
  customerTypeAddPath,
  customerTypeListUrl,
  type CustomerTypeListUrlQueryParams,
  CustomerTypeListUrlSortField,
  customerTypePath,
  customerTypesPath,
  type CustomerTypeUrlQueryParams,
} from "./urls";
import CustomerTypeDetailsComponent from "./views/CustomerTypeDetails";
import CustomerTypeListComponent from "./views/CustomerTypeList/CustomerTypeList";

const CustomerTypeList = ({ location }: RouteComponentProps<{}>) => {
  const qs = parseQs(location.search.substr(1)) as any;
  const params: CustomerTypeListUrlQueryParams = asSortParams(qs, CustomerTypeListUrlSortField);

  return <CustomerTypeListComponent params={params} />;
};

const CustomerTypeCreateRedirect = () => (
  <Redirect to={customerTypeListUrl({ action: "create" })} />
);

interface CustomerTypeDetailsRouteParams {
  id: string;
}

const CustomerTypeDetails: React.FC<RouteComponentProps<CustomerTypeDetailsRouteParams>> = ({
  match,
  location,
}) => {
  const qs = parseQs(location.search.substr(1));
  const params: CustomerTypeUrlQueryParams = qs;

  return <CustomerTypeDetailsComponent id={decodeURIComponent(match.params.id)} params={params} />;
};

const CustomerTypeRouter = () => {
  const intl = useIntl();

  return (
    <>
      <WindowTitle title={intl.formatMessage(sectionNames.customerTypes)} />
      <Switch>
        <Route exact path={customerTypesPath} component={CustomerTypeList} />
        <Route exact path={customerTypeAddPath} component={CustomerTypeCreateRedirect} />
        <Route path={customerTypePath(":id")} component={CustomerTypeDetails} />
      </Switch>
    </>
  );
};

CustomerTypeRouter.displayName = "CustomerTypeRouter";
export default CustomerTypeRouter;
