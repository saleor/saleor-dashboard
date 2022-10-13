import useQueryParams from "@saleor/hooks/useQueryParams";
import { sectionNames } from "@saleor/intl";
import React from "react";
import { useIntl } from "react-intl";
import { Route, RouteComponentProps, Switch } from "react-router-dom";

import { WindowTitle } from "../components/WindowTitle";
import {
  shippingRateCreatePath,
  ShippingRateCreateUrlQueryParams,
  shippingRateEditPath,
  ShippingRateUrlQueryParams,
  shippingZoneAddPath,
  shippingZonePath,
  shippingZonesListPath,
  ShippingZonesListUrlQueryParams,
  ShippingZoneUrlQueryParams,
} from "./urls";
import RateCreateComponent from "./views/RateCreate";
import RateUpdateComponent from "./views/RateUpdate";
import ShippingZoneCreate from "./views/ShippingZoneCreate";
import ShippingZoneDetailsComponent from "./views/ShippingZoneDetails";
import ShippingZonesListComponent from "./views/ShippingZonesList";

const ShippingZonesList: React.FC<RouteComponentProps<{}>> = () => {
  const qs = useQueryParams<ShippingZonesListUrlQueryParams>();
  const params: ShippingZonesListUrlQueryParams = qs;
  return <ShippingZonesListComponent params={params} />;
};

interface ShippingZoneDetailsRouteProps {
  id: string;
}
const ShippingZoneDetails: React.FC<RouteComponentProps<
  ShippingZoneDetailsRouteProps
>> = ({ match }) => {
  const qs = useQueryParams<ShippingZoneUrlQueryParams>();
  const params: ShippingZoneUrlQueryParams = qs;
  return (
    <ShippingZoneDetailsComponent
      id={decodeURIComponent(match.params.id)}
      params={params}
    />
  );
};

const RateCreate: React.FC<RouteComponentProps<{ id: string }>> = ({
  match,
}) => {
  const qs = useQueryParams<ShippingRateCreateUrlQueryParams>();
  const params: ShippingRateCreateUrlQueryParams = qs;

  return (
    <RateCreateComponent
      id={decodeURIComponent(match.params.id)}
      params={params}
    />
  );
};

const RateUpdate: React.FC<RouteComponentProps<{
  id: string;
  rateId: string;
}>> = ({ match }) => {
  const qs = useQueryParams<ShippingRateUrlQueryParams>();
  const params: ShippingRateUrlQueryParams = qs;

  return (
    <RateUpdateComponent
      id={decodeURIComponent(match.params.id)}
      rateId={decodeURIComponent(match.params.rateId)}
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
        <Route
          exact
          path={shippingZonePath(":id")}
          component={ShippingZoneDetails}
        />
        <Route path={shippingRateCreatePath(":id")} component={RateCreate} />
        <Route
          path={shippingRateEditPath(":id", ":rateId")}
          component={RateUpdate}
        />
      </Switch>
    </>
  );
};
export default ShippingRouter;
