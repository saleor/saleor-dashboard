import { Route } from "@dashboard/components/Router";
import { asSortParams } from "@dashboard/utils/sort";
import { parse as parseQs } from "qs";
import { RouteComponentProps, Switch } from "react-router-dom";

import { menuListPath, MenuListUrlQueryParams, MenuListUrlSortField, menuPath } from "./urls";
import MenuDetailsComponent from "./views/MenuDetails";
import MenuListComponent from "./views/MenuList";

const MenuList = ({ location }: RouteComponentProps<{}>) => {
  const qs = parseQs(location.search.substr(1)) as any;
  const params: MenuListUrlQueryParams = asSortParams(qs, MenuListUrlSortField);

  return <MenuListComponent params={params} />;
};
const MenuDetails = ({ location, match }: RouteComponentProps<{ id: string }>) => {
  const qs = parseQs(location.search.substr(1));

  return <MenuDetailsComponent id={decodeURIComponent(match.params.id)} params={qs} />;
};
const NavigationRouter = () => (
  <Switch>
    <Route exact component={MenuList} path={menuListPath} />
    <Route component={MenuDetails} path={menuPath(":id")} />
  </Switch>
);

export default NavigationRouter;
