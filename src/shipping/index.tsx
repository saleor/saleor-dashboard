import { parse as parseQs } from "qs";
import React from "react";
import { useIntl } from "react-intl";
import { Route, RouteComponentProps, Switch } from "react-router-dom";

import { sectionNames } from "@saleor/intl";
import { WindowTitle } from "../components/WindowTitle";
import {
  shippingZoneAddPath,
  shippingZonePath,
  shippingZonesListPath,
  ShippingZonesListUrlQueryParams,
  ShippingZoneUrlQueryParams
} from "./urls";
import ShippingZoneCreate from "./views/ShippingZoneCreate";
import ShippingZoneDetailsComponent from "./views/ShippingZoneDetails";
import ShippingZonesListComponent from "./views/ShippingZonesList";

const ShippingZonesList: React.FC<RouteComponentProps<{}>> = ({ location }) => {
  const qs = parseQs(location.search.substr(1));
  const params: ShippingZonesListUrlQueryParams = qs;
  return <ShippingZonesListComponent params={params} />;
};

interface ShippingZoneDetailsRouteProps {
  id: string;
}
const ShippingZoneDetails: React.FC<
  RouteComponentProps<ShippingZoneDetailsRouteProps>
> = ({ location, match }) => {
  const qs = parseQs(location.search.substr(1));
  const params: ShippingZoneUrlQueryParams = qs;
  return (
    <ShippingZoneDetailsComponent
      id={decodeURIComponent(match.params.id)}
      params={params}
    />
  );
};

export const ShippingRouter: React.FC = () => {
  const intl = useIntl();

  return (
    <>
      <WindowTitle title={intl.formatMessage(sectionNames.shipping)} />
      <Switch>
        <Route
          exact
          path={shippingZonesListPath}
          component={ShippingZonesList}
        />
        <Route
          exact
          path={shippingZoneAddPath}
          component={ShippingZoneCreate}
        />
        <Route path={shippingZonePath(":id")} component={ShippingZoneDetails} />
      </Switch>
    </>
  );
};
export default ShippingRouter;
