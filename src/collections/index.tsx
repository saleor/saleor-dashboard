import { ConditionalCollectionFilterProvider } from "@dashboard/components/ConditionalFilter";
import { Route } from "@dashboard/components/Router";
import { sectionNames } from "@dashboard/intl";
import { parseQs } from "@dashboard/url-utils";
import { asSortParams } from "@dashboard/utils/sort";
import { useIntl } from "react-intl";
import { RouteComponentProps, Switch } from "react-router-dom";

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

const CollectionList = ({ location }: RouteComponentProps<{}>) => {
  const qs = parseQs(location.search.substr(1)) as any;
  const params: CollectionListUrlQueryParams = asSortParams(qs, CollectionListUrlSortField);

  return (
    <ConditionalCollectionFilterProvider locationSearch={location.search}>
      <CollectionListView params={params} />
    </ConditionalCollectionFilterProvider>
  );
};

interface CollectionDetailsRouteProps {
  id: string;
}

const CollectionDetails = ({
  location,
  match,
}: RouteComponentProps<CollectionDetailsRouteProps>) => {
  const qs = parseQs(location.search.substr(1));
  const params: CollectionUrlQueryParams = qs;

  return <CollectionDetailsView id={decodeURIComponent(match.params.id)} params={params} />;
};

const CollectionCreate = ({ location }: RouteComponentProps) => {
  const qs = parseQs(location.search.substr(1));
  const params: CollectionCreateUrlQueryParams = qs;

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
