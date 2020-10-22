import { sectionNames } from "@saleor/intl";
import { asSortParams } from "@saleor/utils/sort";
import { parse as parseQs } from "qs";
import React from "react";
import { useIntl } from "react-intl";
import { Route, RouteComponentProps, Switch } from "react-router-dom";

import { WindowTitle } from "../components/WindowTitle";
import {
  pageTypeAddPath,
  pageTypeListPath,
  PageTypeListUrlQueryParams,
  PageTypeListUrlSortField,
  pageTypePath,
  PageTypeUrlQueryParams
} from "./urls";
import PageTypeCreate from "./views/PageTypeCreate";
import PageTypeListComponent from "./views/PageTypeList";
import PageTypeUpdateComponent from "./views/PageTypeUpdate";

const PageTypeList: React.FC<RouteComponentProps<{}>> = ({ location }) => {
  const qs = parseQs(location.search.substr(1));
  const params: PageTypeListUrlQueryParams = asSortParams(
    qs,
    PageTypeListUrlSortField
  );
  return <PageTypeListComponent params={params} />;
};

interface PageTypeUpdateRouteParams {
  id: string;
}
const PageTypeUpdate: React.FC<RouteComponentProps<
  PageTypeUpdateRouteParams
>> = ({ match }) => {
  const qs = parseQs(location.search.substr(1));
  const params: PageTypeUrlQueryParams = qs;

  return (
    <PageTypeUpdateComponent
      id={decodeURIComponent(match.params.id)}
      params={params}
    />
  );
};

export const PageTypeRouter: React.FC = () => {
  const intl = useIntl();

  return (
    <>
      <WindowTitle title={intl.formatMessage(sectionNames.pageTypes)} />
      <Switch>
        <Route exact path={pageTypeListPath} component={PageTypeList} />
        <Route exact path={pageTypeAddPath} component={PageTypeCreate} />
        <Route path={pageTypePath(":id")} component={PageTypeUpdate} />
      </Switch>
    </>
  );
};
PageTypeRouter.displayName = "PageTypeRouter";
export default PageTypeRouter;
