import { Route } from "@dashboard/components/Router";
import { asSortParams } from "@dashboard/utils/sort";
import { parse as parseQs } from "qs";
import React from "react";
import { RouteComponentProps, Switch } from "react-router-dom";

import { MenuListUrlQueryParams, MenuListUrlSortField, menuPath, structuresListPath } from "./urls";
import MenuDetailsComponent from "./views/MenuDetails";
import MenuListComponent from "./views/MenuList";

const MenuList: React.FC<RouteComponentProps<{}>> = ({ location }) => {
  const qs = parseQs(location.search.substr(1)) as any;
  const params: MenuListUrlQueryParams = asSortParams(qs, MenuListUrlSortField);

  return <MenuListComponent params={params} />;
};
const MenuDetails: React.FC<RouteComponentProps<{ id: string }>> = ({ location, match }) => {
  const qs = parseQs(location.search.substr(1));

  return <MenuDetailsComponent id={decodeURIComponent(match.params.id)} params={qs} />;
};
const NavigationRouter: React.FC = () => (
  <Switch>
    <Route exact component={MenuList} path={structuresListPath} />
    <Route component={MenuDetails} path={menuPath(":id")} />
  </Switch>
);

export default NavigationRouter;
