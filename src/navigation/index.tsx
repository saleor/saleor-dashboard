import useQueryParams from "@saleor/hooks/useQueryParams";
import { asSortParams } from "@saleor/utils/sort";
import React from "react";
import { Route, RouteComponentProps, Switch } from "react-router-dom";

import {
  menuListPath,
  MenuListUrlQueryParams,
  MenuListUrlSortField,
  menuPath,
} from "./urls";
import MenuDetailsComponent from "./views/MenuDetails";
import MenuListComponent from "./views/MenuList";

const MenuList: React.FC<RouteComponentProps<{}>> = () => {
  const qs = useQueryParams<MenuListUrlQueryParams>();
  const params: MenuListUrlQueryParams = asSortParams(qs, MenuListUrlSortField);

  return <MenuListComponent params={params} />;
};

const MenuDetails: React.FC<RouteComponentProps<{ id: string }>> = ({
  match,
}) => {
  const qs = useQueryParams();

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
