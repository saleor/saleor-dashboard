import { Route } from "@dashboard/components/Router";
import { parseQs } from "@dashboard/url-utils";
import { asSortParams } from "@dashboard/utils/sort";
import { RouteComponentProps, Switch } from "react-router-dom";

import { MenuListUrlQueryParams, MenuListUrlSortField, menuPath, structuresListPath } from "./urls";
import MenuDetailsComponent from "./views/MenuDetails";
import MenuListComponent from "./views/MenuList";

const MenuList = () => {
  const qs = parseQs(location.search.substr(1)) as any;
  const params: MenuListUrlQueryParams = asSortParams(qs, MenuListUrlSortField);

  return <MenuListComponent params={params} />;
};
const MenuDetails = ({ match }: RouteComponentProps<{ id: string }>) => {
  const qs = parseQs(location.search.substr(1));

  return <MenuDetailsComponent id={decodeURIComponent(match.params.id)} params={qs} />;
};
const NavigationRouter = () => (
  <Switch>
    <Route exact component={MenuList} path={structuresListPath} />
    <Route component={MenuDetails} path={menuPath(":id")} />
  </Switch>
);

export default NavigationRouter;
