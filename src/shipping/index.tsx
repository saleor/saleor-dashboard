import { Route } from "@dashboard/components/Router";
import { sectionNames } from "@dashboard/intl";
import { parseQs } from "@dashboard/url-utils";
import { useIntl } from "react-intl";
import { RouteComponentProps, Switch } from "react-router-dom";

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

const ShippingZonesList = ({ location }: RouteComponentProps<{}>) => {
  const qs = parseQs(location.search.substr(1));
  const params: ShippingZonesListUrlQueryParams = qs;

  return <ShippingZonesListComponent params={params} />;
};

interface ShippingZoneDetailsRouteProps {
  id: string;
}

const ShippingZoneDetails = ({
  location,
  match,
}: RouteComponentProps<ShippingZoneDetailsRouteProps>) => {
  const qs = parseQs(location.search.substr(1));
  const params: ShippingZoneUrlQueryParams = qs;

  return <ShippingZoneDetailsComponent id={decodeURIComponent(match.params.id)} params={params} />;
};
const RateCreate = ({ match }: RouteComponentProps<{ id: string }>) => {
  const qs = parseQs(location.search.substr(1));
  const params: ShippingRateCreateUrlQueryParams = qs;

  return <RateCreateComponent id={decodeURIComponent(match.params.id)} params={params} />;
};
const RateUpdate = ({
  match,
}: RouteComponentProps<{
  id: string;
  rateId: string;
}>) => {
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

const ShippingRouter = () => {
  const intl = useIntl();

  return (
    <>
      <WindowTitle title={intl.formatMessage(sectionNames.shipping)} />
      <Switch>
        <Route exact path={shippingZonesListPath} component={ShippingZonesList} />
        <Route exact path={shippingZoneAddPath} component={ShippingZoneCreate} />
        <Route exact path={shippingZonePath(":id")} component={ShippingZoneDetails} />
        <Route path={shippingRateCreatePath(":id")} component={RateCreate} />
        <Route path={shippingRateEditPath(":id", ":rateId")} component={RateUpdate} />
      </Switch>
    </>
  );
};

export default ShippingRouter;
