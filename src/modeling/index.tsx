import { Route } from "@dashboard/components/Router";
import { sectionNames } from "@dashboard/intl";
import { parseQs } from "@dashboard/url-utils";
import { asSortParams } from "@dashboard/utils/sort";
import { getArrayQueryParam } from "@dashboard/utils/urls";
import { useIntl } from "react-intl";
import { type RouteComponentProps, Switch } from "react-router-dom";

import { WindowTitle } from "../components/WindowTitle";
import {
  pageCreatePath,
  type PageCreateUrlQueryParams,
  pageListPath,
  type PageListUrlQueryParams,
  PageListUrlSortField,
  pagePath,
  type PageUrlQueryParams,
} from "./urls";
import PageCreateComponent from "./views/PageCreate";
import PageDetailsComponent from "./views/PageDetails";
import PageListComponent from "./views/PageList";

const PageList = ({ location }: RouteComponentProps) => {
  const qs = parseQs(location.search.substr(1)) as any;
  const params: PageListUrlQueryParams = asSortParams(
    {
      ...qs,
      ids: getArrayQueryParam(qs.ids),
      pageTypes: getArrayQueryParam(qs.pageTypes),
    },
    PageListUrlSortField,
    PageListUrlSortField.title,
  );

  return <PageListComponent params={params} />;
};
const PageCreate = ({ match }: RouteComponentProps<{ id: string }>) => {
  const qs = parseQs(location.search.substr(1));
  const params: PageCreateUrlQueryParams = qs;

  return <PageCreateComponent id={decodeURIComponent(match.params.id)} params={params} />;
};
const PageDetails = ({ match }: RouteComponentProps<{ id: string }>) => {
  const qs = parseQs(location.search.substr(1));
  const params: PageUrlQueryParams = qs;

  return <PageDetailsComponent id={decodeURIComponent(match.params.id)} params={params} />;
};
const Component = () => {
  const intl = useIntl();

  return (
    <>
      <WindowTitle title={intl.formatMessage(sectionNames.models)} />
      <Switch>
        <Route exact path={pageListPath} component={PageList} />
        <Route exact path={pageCreatePath} component={PageCreate} />
        <Route path={pagePath(":id")} component={PageDetails} />
      </Switch>
    </>
  );
};

export default Component;
