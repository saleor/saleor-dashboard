import { parse as parseQs } from "qs";
import React from "react";
import { useIntl } from "react-intl";
import { Route, RouteComponentProps, Switch } from "react-router-dom";

import { sectionNames } from "@saleor/intl";
import { asSortParams } from "@saleor/utils/sort";
import { WindowTitle } from "../components/WindowTitle";
import {
  permissionGroupListPath,
  permissionGroupDetailsPath,
  permissionGroupAddPath,
  PermissionGroupListUrlQueryParams,
  PermissionGroupListUrlSortField,
  PermissionGroupDetailsUrlQueryParams,
  MembersListUrlSortField
} from "./urls";
import PermissionGroupListComponent from "./views/PermissionGroupList";
import PermissionGroupDetailsComponent from "./views/PermissionGroupDetails";
import PermissionGroupCreate from "./views/PermissionGroupCreate";

const permissionGroupList: React.FC<RouteComponentProps<{}>> = ({
  location
}) => {
  const qs = parseQs(location.search.substr(1));
  const params: PermissionGroupListUrlQueryParams = asSortParams(
    qs,
    PermissionGroupListUrlSortField
  );

  return <PermissionGroupListComponent params={params} />;
};

interface PermissionGroupDetailsRouteProps {
  id: string;
}
const PermissionGroupDetails: React.FC<RouteComponentProps<
  PermissionGroupDetailsRouteProps
>> = ({ match }) => {
  const qs = parseQs(location.search.substr(1));
  const params: PermissionGroupDetailsUrlQueryParams = asSortParams(
    qs,
    MembersListUrlSortField
  );

  return (
    <PermissionGroupDetailsComponent
      id={decodeURIComponent(match.params.id)}
      params={params}
    />
  );
};

const Component = () => {
  const intl = useIntl();

  return (
    <>
      <WindowTitle title={intl.formatMessage(sectionNames.permissionGroups)} />
      <Switch>
        <Route
          exact
          path={permissionGroupListPath}
          component={permissionGroupList}
        />
        <Route
          path={permissionGroupAddPath}
          component={PermissionGroupCreate}
        />
        <Route
          path={permissionGroupDetailsPath(":id")}
          component={PermissionGroupDetails}
        />
      </Switch>
    </>
  );
};

export default Component;
