import { Route } from "@dashboard/components/Router";
import { sectionNames } from "@dashboard/intl";
import { parseQs } from "@dashboard/url-utils";
import { asSortParams } from "@dashboard/utils/sort";
import { useIntl } from "react-intl";
import { RouteComponentProps, Switch } from "react-router-dom";

import { WindowTitle } from "../components/WindowTitle";
import {
  categoryAddPath,
  categoryListPath,
  CategoryListUrlQueryParams,
  CategoryListUrlSortField,
  categoryPath,
  CategoryUrlQueryParams,
} from "./urls";
import { CategoryCreateView } from "./views/CategoryCreate";
import CategoryDetailsView from "./views/CategoryDetails";
import CategoryListComponent from "./views/CategoryList";

interface CategoryDetailsRouteParams {
  id: string;
}

const CategoryDetails = ({ location, match }: RouteComponentProps<CategoryDetailsRouteParams>) => {
  const qs = parseQs(location.search.substr(1));
  const params: CategoryUrlQueryParams = qs;

  return <CategoryDetailsView id={decodeURIComponent(match.params.id)} params={params} />;
};

interface CategoryCreateRouteParams {
  id: string;
}

const CategoryCreate = ({ match }: RouteComponentProps<CategoryCreateRouteParams>) => (
  <CategoryCreateView
    parentId={match.params.id ? decodeURIComponent(match.params.id) : undefined}
  />
);

const CategoryList = ({ location }: RouteComponentProps<{}>) => {
  const qs = parseQs(location.search.substr(1)) as any;
  const params: CategoryListUrlQueryParams = {
    ...asSortParams(qs, CategoryListUrlSortField),
  };

  return <CategoryListComponent params={params} />;
};

const Component = () => {
  const intl = useIntl();

  return (
    <>
      <WindowTitle title={intl.formatMessage(sectionNames.categories)} />
      <Switch>
        <Route exact path={categoryListPath} component={CategoryList} />
        <Route exact path={categoryAddPath()} component={CategoryCreate} />
        <Route exact path={categoryAddPath(":id")} component={CategoryCreate} />
        <Route path={categoryPath(":id")} component={CategoryDetails} />
      </Switch>
    </>
  );
};

export default Component;
