import { Route } from "@dashboard/components/Router";
import { sectionNames } from "@dashboard/intl";
import { parseQs } from "@dashboard/url-utils";
import { asSortParams } from "@dashboard/utils/sort";
import { useIntl } from "react-intl";
import { Redirect, type RouteComponentProps, Switch } from "react-router-dom";

import { WindowTitle } from "../components/WindowTitle";
import {
  warehouseAddPath,
  warehouseAddUrl,
  warehouseListPath,
  type WarehouseListUrlQueryParams,
  WarehouseListUrlSortField,
  warehousePath,
  type WarehouseUrlQueryParams,
} from "./urls";
import WarehouseDetailsComponent from "./views/WarehouseDetails/WarehouseDetails";
import WarehouseListComponent from "./views/WarehouseList/WarehouseList";

const WarehouseList = ({ location }: RouteComponentProps) => {
  const qs = parseQs(location.search.substr(1)) as any;
  const params: WarehouseListUrlQueryParams = asSortParams(qs, WarehouseListUrlSortField);

  return <WarehouseListComponent params={params} />;
};
const WarehouseDetails = ({ match, location }: RouteComponentProps<{ id: string }>) => {
  const qs = parseQs(location.search.substr(1));
  const params: WarehouseUrlQueryParams = qs;

  return <WarehouseDetailsComponent id={decodeURIComponent(match.params.id)} params={params} />;
};

const WarehouseCreateRedirect = () => <Redirect to={warehouseAddUrl} />;

const WarehouseSection = () => {
  const intl = useIntl();

  return (
    <>
      <WindowTitle title={intl.formatMessage(sectionNames.warehouses)} />
      <Switch>
        <Route exact path={warehouseListPath} component={WarehouseList} />
        <Route exact path={warehouseAddPath} component={WarehouseCreateRedirect} />
        <Route path={warehousePath(":id")} component={WarehouseDetails} />
      </Switch>
    </>
  );
};

export default WarehouseSection;
