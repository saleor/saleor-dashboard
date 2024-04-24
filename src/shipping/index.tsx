import { sectionNames } from "@dashboard/intl";
import { parse as parseQs } from "qs";
import React from "react";
import { useIntl } from "react-intl";
import { Route, RouteComponentProps, Routes } from "react-router-dom";

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

const RateCreate: React.FC<RouteComponentProps<{ id: string }>> = ({
  match,
}) => {
  const qs = parseQs(location.search.substr(1));
  const params: ShippingRateCreateUrlQueryParams = qs;

  return (
    <RateCreateComponent
      id={decodeURIComponent(match.params.id)}
      params={params}
    />
  );
};

const RateUpdate: React.FC<
  RouteComponentProps<{
    id: string;
    rateId: string;
  }>
> = ({ match }) => {
  const qs = parseQs(location.search.substr(1));
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
      <Routes>
        <Route path={shippingZonesListPath} element={ShippingZonesList} />
        <Route path={shippingZoneAddPath} element={ShippingZoneCreate} />
        <Route path={shippingZonePath(":id")} element={ShippingZoneDetails} />
        <Route path={shippingRateCreatePath(":id")} element={RateCreate} />
        <Route
          path={shippingRateEditPath(":id", ":rateId")}
          element={RateUpdate}
        />
      </Routes>
    </>
  );
};
export default ShippingRouter;
