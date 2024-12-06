import { Route } from "@dashboard/components/Router";
import { sectionNames } from "@dashboard/intl";
import { asSortParams } from "@dashboard/utils/sort";
import { parse as parseQs } from "qs";
import React from "react";
import { useIntl } from "react-intl";
import { RouteComponentProps, Switch } from "react-router-dom";

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

const PageList = ({ location }: RouteComponentProps<{}>) => {
  const qs = parseQs(location.search.substr(1)) as any;
  const params: PageListUrlQueryParams = asSortParams(
    qs,
    PageListUrlSortField,
    PageListUrlSortField.title,
  );

  return <PageListComponent params={params} />;
};
const PageCreate = ({ match }: RouteComponentProps<any>) => {
  const qs = parseQs(location.search.substr(1));
  const params: PageCreateUrlQueryParams = qs;

  return <PageCreateComponent id={decodeURIComponent(match.params.id)} params={params} />;
};
const PageDetails = ({ match }: RouteComponentProps<any>) => {
  const qs = parseQs(location.search.substr(1));
  const params: PageUrlQueryParams = qs;

  return <PageDetailsComponent id={decodeURIComponent(match.params.id)} params={params} />;
};
const Component = () => {
  const intl = useIntl();

  return (
    <>
      <WindowTitle title={intl.formatMessage(sectionNames.content)} />
      <Switch>
        <Route exact path={pageListPath} component={PageList} />
        <Route exact path={pageCreatePath} component={PageCreate} />
        <Route path={pagePath(":id")} component={PageDetails} />
      </Switch>
    </>
  );
};

export default Component;
