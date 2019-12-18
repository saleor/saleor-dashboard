import { parse as parseQs } from "qs";
import React from "react";
import { useIntl } from "react-intl";
import { Route, RouteComponentProps, Switch } from "react-router-dom";

import { sectionNames } from "@saleor/intl";
import { asSortParams } from "@saleor/utils/sort";
import { WindowTitle } from "../components/WindowTitle";
import {
  collectionAddPath,
  collectionListPath,
  CollectionListUrlQueryParams,
  collectionPath,
  CollectionUrlQueryParams,
  CollectionListUrlSortField
} from "./urls";
import CollectionCreate from "./views/CollectionCreate";
import CollectionDetailsView from "./views/CollectionDetails";
import CollectionListView from "./views/CollectionList";

const CollectionList: React.FC<RouteComponentProps<{}>> = ({ location }) => {
  const qs = parseQs(location.search.substr(1));
  const params: CollectionListUrlQueryParams = asSortParams(
    qs,
    CollectionListUrlSortField
  );
  return <CollectionListView params={params} />;
};

interface CollectionDetailsRouteProps {
  id: string;
}
const CollectionDetails: React.FC<RouteComponentProps<
  CollectionDetailsRouteProps
>> = ({ location, match }) => {
  const qs = parseQs(location.search.substr(1));
  const params: CollectionUrlQueryParams = qs;
  return (
    <CollectionDetailsView
      id={decodeURIComponent(match.params.id)}
      params={params}
    />
  );
};

const Component = () => {
  const intl = useIntl();

  return (
    <>
      <WindowTitle title={intl.formatMessage(sectionNames.collections)} />
      <Switch>
        <Route exact path={collectionListPath} component={CollectionList} />
        <Route exact path={collectionAddPath} component={CollectionCreate} />
        <Route path={collectionPath(":id")} component={CollectionDetails} />
      </Switch>
    </>
  );
};
export default Component;
