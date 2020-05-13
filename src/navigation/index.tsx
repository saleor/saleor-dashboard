import { asSortParams } from "@saleor/utils/sort";
import { parse as parseQs } from "qs";
import React from "react";
import { Route, RouteComponentProps, Switch } from "react-router-dom";

import {
  menuListPath,
  MenuListUrlQueryParams,
  MenuListUrlSortField,
  menuPath
} from "./urls";
import MenuDetailsComponent from "./views/MenuDetails";
import MenuListComponent from "./views/MenuList";

const MenuList: React.FC<RouteComponentProps<{}>> = ({ location }) => {
  const qs = parseQs(location.search.substr(1));
  const params: MenuListUrlQueryParams = asSortParams(qs, MenuListUrlSortField);

  return <MenuListComponent params={params} />;
};

const MenuDetails: React.FC<RouteComponentProps<{ id: string }>> = ({
  location,
  match
}) => {
  const qs = parseQs(location.search.substr(1));

  return (
    <MenuDetailsComponent
      id={decodeURIComponent(match.params.id)}
      params={qs}
    />
  );
};

const NavigationRouter: React.FC = () => (
  <Switch>
    <Route exact component={MenuList} path={menuListPath} />
    <Route component={MenuDetails} path={menuPath(":id")} />
  </Switch>
);

export default NavigationRouter;
