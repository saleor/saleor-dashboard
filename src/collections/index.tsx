import { parse as parseQs } from "qs";
import React from "react";
import { useIntl } from "react-intl";
import { Route, RouteComponentProps, Switch } from "react-router-dom";

import { sectionNames } from "@saleor/intl";
import { WindowTitle } from "../components/WindowTitle";
import {
  collectionAddPath,
  collectionListPath,
  CollectionListUrlQueryParams,
  collectionPath,
  CollectionUrlQueryParams
} from "./urls";
import CollectionCreate from "./views/CollectionCreate";
import CollectionDetailsView from "./views/CollectionDetails";
import CollectionListView from "./views/CollectionList";

const CollectionList: React.StatelessComponent<RouteComponentProps<{}>> = ({
  location
}) => {
  const qs = parseQs(location.search.substr(1));
  const params: CollectionListUrlQueryParams = qs;
  return <CollectionListView params={params} />;
};

interface CollectionDetailsRouteProps {
  id: string;
}
const CollectionDetails: React.StatelessComponent<
  RouteComponentProps<CollectionDetailsRouteProps>
> = ({ location, match }) => {
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
