import useQueryParams from "@saleor/hooks/useQueryParams";
import { sectionNames } from "@saleor/intl";
import { asSortParams } from "@saleor/utils/sort";
import React from "react";
import { useIntl } from "react-intl";
import { Route, RouteComponentProps, Switch } from "react-router-dom";

import { WindowTitle } from "../components/WindowTitle";
import {
  collectionAddPath,
  CollectionCreateUrlQueryParams,
  collectionListPath,
  CollectionListUrlQueryParams,
  CollectionListUrlSortField,
  collectionPath,
  CollectionUrlQueryParams,
} from "./urls";
import CollectionCreateView from "./views/CollectionCreate";
import CollectionDetailsView from "./views/CollectionDetails";
import CollectionListView from "./views/CollectionList";

const CollectionList: React.FC<RouteComponentProps<{}>> = () => {
  const qs = useQueryParams<CollectionListUrlQueryParams>();
  const params: CollectionListUrlQueryParams = asSortParams(
    qs,
    CollectionListUrlSortField,
  );
  return <CollectionListView params={params} />;
};

interface CollectionDetailsRouteProps {
  id: string;
}
const CollectionDetails: React.FC<RouteComponentProps<
  CollectionDetailsRouteProps
>> = ({ match }) => {
  const params = useQueryParams<CollectionUrlQueryParams>();
  return (
    <CollectionDetailsView
      id={decodeURIComponent(match.params.id)}
      params={params}
    />
  );
};

const CollectionCreate: React.FC<RouteComponentProps> = () => {
  const params = useQueryParams<CollectionCreateUrlQueryParams>();
  return <CollectionCreateView params={params} />;
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
