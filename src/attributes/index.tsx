import { sectionNames } from "@dashboard/intl";
import { asSortParams } from "@dashboard/utils/sort";
import { parse as parseQs } from "qs";
import React from "react";
import { useIntl } from "react-intl";
import { Route, RouteComponentProps, Routes } from "react-router-dom";

import { WindowTitle } from "../components/WindowTitle";
import {
  attributeAddPath,
  AttributeAddUrlQueryParams,
  attributeListPath,
  AttributeListUrlQueryParams,
  AttributeListUrlSortField,
  attributePath,
  AttributeUrlQueryParams,
} from "./urls";
import AttributeCreateComponent from "./views/AttributeCreate";
import AttributeDetailsComponent from "./views/AttributeDetails";
import AttributeListComponent from "./views/AttributeList";

const AttributeList: React.FC<RouteComponentProps<{}>> = ({ location }) => {
  const qs = parseQs(location.search.substr(1)) as any;
  const params: AttributeListUrlQueryParams = asSortParams(
    qs,
    AttributeListUrlSortField,
  );

  return <AttributeListComponent params={params} />;
};

const AttributeCreate: React.FC<RouteComponentProps<{}>> = ({ location }) => {
  const qs = parseQs(location.search.substr(1));
  const params: AttributeAddUrlQueryParams = qs;
  return <AttributeCreateComponent params={params} />;
};

const AttributeDetails: React.FC<RouteComponentProps<{ id: string }>> = ({
  location,
  match,
}) => {
  const qs = parseQs(location.search.substr(1));
  const params: AttributeUrlQueryParams = qs;
  return (
    <AttributeDetailsComponent
      id={decodeURIComponent(match.params.id)}
      params={params}
    />
  );
};

export const AttributeSection: React.FC = () => {
  const intl = useIntl();

  return (
    <>
      <WindowTitle title={intl.formatMessage(sectionNames.attributes)} />
      <Routes>
        <Route path={attributeListPath} element={AttributeList} />
        <Route path={attributeAddPath} element={AttributeCreate} />
        <Route path={attributePath(":id")} element={AttributeDetails} />
      </Routes>
    </>
  );
};
export default AttributeSection;
