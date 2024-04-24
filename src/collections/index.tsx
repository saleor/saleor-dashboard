import { sectionNames } from "@dashboard/intl";
import { asSortParams } from "@dashboard/utils/sort";
import { parse as parseQs } from "qs";
import React from "react";
import { useIntl } from "react-intl";
import { Route, Routes, useLocation, useParams } from "react-router-dom";

import { WindowTitle } from "../components/WindowTitle";
import {
  CollectionCreateUrlQueryParams,
  CollectionListUrlQueryParams,
  CollectionListUrlSortField,
} from "./urls";
import CollectionCreateView from "./views/CollectionCreate";
import CollectionDetailsView from "./views/CollectionDetails";
import CollectionListView from "./views/CollectionList";

const CollectionList: React.FC = () => {
  const location = useLocation();
  const qs = parseQs(location.search.substr(1)) as any;
  const params: CollectionListUrlQueryParams = asSortParams(
    qs,
    CollectionListUrlSortField,
  );
  return <CollectionListView params={params} />;
};

const CollectionDetails: React.FC = () => {
  const params = useParams<{ id: string }>();

  return (
    <CollectionDetailsView
      id={decodeURIComponent(params.id || "")}
      // @ts-expect-error - fix this
      params={params}
    />
  );
};

const CollectionCreate: React.FC = () => {
  const location = useLocation();
  const qs = parseQs(location.search.substr(1));
  const params: CollectionCreateUrlQueryParams = qs;
  return <CollectionCreateView params={params} />;
};

const Component = () => {
  const intl = useIntl();

  return (
    <>
      <WindowTitle title={intl.formatMessage(sectionNames.collections)} />
      <Routes>
        <Route path={"*"} element={<CollectionList />} />
        <Route path={"/add"} element={<CollectionCreate />} />
        <Route path={":id"} element={<CollectionDetails />} />
      </Routes>
    </>
  );
};
export default Component;
