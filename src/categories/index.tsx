import { sectionNames } from "@dashboard/intl";
import { asSortParams } from "@dashboard/utils/sort";
import { parse as parseQs } from "qs";
import React from "react";
import { useIntl } from "react-intl";
import {
  Route,
  RouteComponentProps,
  Routes,
  useLocation,
} from "react-router-dom";

import { WindowTitle } from "../components/WindowTitle";
import {
  categoryAddPath,
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
const CategoryDetails: React.FC<
  RouteComponentProps<CategoryDetailsRouteParams>
> = ({ location, match }) => {
  const qs = parseQs(location.search.substr(1));
  const params: CategoryUrlQueryParams = qs;

  return (
    <CategoryDetailsView
      id={decodeURIComponent(match.params.id)}
      params={params}
    />
  );
};

interface CategoryCreateRouteParams {
  id: string;
}
const CategoryCreate: React.FC<
  RouteComponentProps<CategoryCreateRouteParams>
> = ({ match }) => (
  <CategoryCreateView
    parentId={match.params.id ? decodeURIComponent(match.params.id) : undefined}
  />
);

const CategoryList: React.FC<RouteComponentProps<{}>> = () => {
  const location = useLocation();
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
      <Routes>
        <Route path="*" element={<CategoryList />} />
        <Route path={categoryAddPath()} element={CategoryCreate} />
        <Route path={categoryAddPath(":id")} element={CategoryCreate} />
        <Route path={categoryPath(":id")} element={CategoryDetails} />
      </Routes>
    </>
  );
};

export default Component;
