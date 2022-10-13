import useQueryParams from "@saleor/hooks/useQueryParams";
import { sectionNames } from "@saleor/intl";
import { asSortParams } from "@saleor/utils/sort";
import React from "react";
import { useIntl } from "react-intl";
import { Route, RouteComponentProps, Switch } from "react-router-dom";

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

const AttributeList: React.FC<RouteComponentProps<{}>> = () => {
  const qs = useQueryParams<AttributeListUrlQueryParams>();
  const params: AttributeListUrlQueryParams = asSortParams(
    qs,
    AttributeListUrlSortField,
  );

  return <AttributeListComponent params={params} />;
};

const AttributeCreate: React.FC<RouteComponentProps<{}>> = () => {
  const qs = useQueryParams<AttributeAddUrlQueryParams>();
  const params: AttributeAddUrlQueryParams = qs;
  return <AttributeCreateComponent params={params} />;
};

const AttributeDetails: React.FC<RouteComponentProps<{ id: string }>> = ({
  match,
}) => {
  const qs = useQueryParams<AttributeUrlQueryParams>();
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
      <Switch>
        <Route exact path={attributeListPath} component={AttributeList} />
        <Route exact path={attributeAddPath} component={AttributeCreate} />
        <Route path={attributePath(":id")} component={AttributeDetails} />
      </Switch>
    </>
  );
};
export default AttributeSection;
