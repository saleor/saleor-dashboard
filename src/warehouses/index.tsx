import { sectionNames } from "@saleor/intl";
import { asSortParams } from "@saleor/utils/sort";
import { parse as parseQs } from "qs";
import React from "react";
import { useIntl } from "react-intl";
import { Route, RouteComponentProps, Switch } from "react-router-dom";

import { WindowTitle } from "../components/WindowTitle";
import {
  warehouseAddPath,
  warehouseListPath,
  WarehouseListUrlQueryParams,
  WarehouseListUrlSortField,
  warehousePath,
  WarehouseUrlQueryParams
} from "./urls";
import WarehouseCreate from "./views/WarehouseCreate";
import WarehouseDetailsComponent from "./views/WarehouseDetails";
import WarehouseListComponent from "./views/WarehouseList";

const WarehouseList: React.FC<RouteComponentProps> = ({ location }) => {
  const qs = parseQs(location.search.substr(1));
  const params: WarehouseListUrlQueryParams = asSortParams(
    qs,
    WarehouseListUrlSortField
  );

  return <WarehouseListComponent params={params} />;
};

const WarehouseDetails: React.FC<RouteComponentProps<{ id: string }>> = ({
  location,
  match
}) => {
  const qs = parseQs(location.search.substr(1));
  const params: WarehouseUrlQueryParams = qs;
  return (
    <WarehouseDetailsComponent
      id={decodeURIComponent(match.params.id)}
      params={params}
    />
  );
};

export const WarehouseSection: React.FC = () => {
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
