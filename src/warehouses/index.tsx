import { Route } from "@dashboard/components/Router";
import { sectionNames } from "@dashboard/intl";
import { parseQs } from "@dashboard/url-utils";
import { asSortParams } from "@dashboard/utils/sort";
import { useIntl } from "react-intl";
import { RouteComponentProps, Switch } from "react-router-dom";

import { WindowTitle } from "../components/WindowTitle";
import {
  warehouseAddPath,
  warehouseListPath,
  WarehouseListUrlQueryParams,
  WarehouseListUrlSortField,
  warehousePath,
  WarehouseUrlQueryParams,
} from "./urls";
import WarehouseCreate from "./views/WarehouseCreate";
import WarehouseDetailsComponent from "./views/WarehouseDetails";
import WarehouseListComponent from "./views/WarehouseList";

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

const WarehouseSection = () => {
  const intl = useIntl();

  return (
    <>
      <WindowTitle title={intl.formatMessage(sectionNames.warehouses)} />
      <Switch>
        <Route exact path={warehouseListPath} component={WarehouseList} />
        <Route exact path={warehouseAddPath} component={WarehouseCreate} />
        <Route path={warehousePath(":id")} component={WarehouseDetails} />
      </Switch>
    </>
  );
};

export default WarehouseSection;
