import { sectionNames } from "@saleor/intl";
import { asSortParams } from "@saleor/utils/sort";
import { parse as parseQs } from "qs";
import React from "react";
import { useIntl } from "react-intl";
import { Route, RouteComponentProps, Switch } from "react-router-dom";

import { WindowTitle } from "../components/WindowTitle";
import {
  pageCreatePath,
  PageCreateUrlQueryParams,
  pageListPath,
  PageListUrlQueryParams,
  PageListUrlSortField,
  pagePath,
  PageUrlQueryParams,
} from "./urls";
import PageCreateComponent from "./views/PageCreate";
import PageDetailsComponent from "./views/PageDetails";
import PageListComponent from "./views/PageList";

const PageList: React.FC<RouteComponentProps<{}>> = ({ location }) => {
  const qs = parseQs(location.search.substr(1));
  const params: PageListUrlQueryParams = asSortParams(
    qs,
    PageListUrlSortField,
    PageListUrlSortField.title,
  );
  return <PageListComponent params={params} />;
};

const PageCreate: React.FC<RouteComponentProps<any>> = ({ match }) => {
  const qs = parseQs(location.search.substr(1));
  const params: PageCreateUrlQueryParams = qs;

  return (
    <PageCreateComponent
      id={decodeURIComponent(match.params.id)}
      params={params}
    />
  );
};

const PageDetails: React.FC<RouteComponentProps<any>> = ({ match }) => {
  const qs = parseQs(location.search.substr(1));
  const params: PageUrlQueryParams = qs;

  return (
    <PageDetailsComponent
      id={decodeURIComponent(match.params.id)}
      params={params}
    />
  );
};

const Component = () => {
  const intl = useIntl();

  return (
    <>
      <WindowTitle title={intl.formatMessage(sectionNames.pages)} />
      <Switch>
        <Route exact path={pageListPath} component={PageList} />
        <Route exact path={pageCreatePath} component={PageCreate} />
        <Route path={pagePath(":id")} component={PageDetails} />
      </Switch>
    </>
  );
};

export default Component;
