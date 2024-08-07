import { Route } from "@dashboard/components/Router";
import { sectionNames } from "@dashboard/intl";
import { asSortParams } from "@dashboard/utils/sort";
import { parse as parseQs } from "qs";
import React from "react";
import { useIntl } from "react-intl";
import { RouteComponentProps, Switch } from "react-router-dom";

import { WindowTitle } from "../components/WindowTitle";
import {
  MembersListUrlSortField,
  permissionGroupAddPath,
  permissionGroupDetailsPath,
  PermissionGroupDetailsUrlQueryParams,
  permissionGroupListPath,
  PermissionGroupListUrlQueryParams,
  PermissionGroupListUrlSortField,
} from "./urls";
import { PermissionGroupCreate } from "./views/PermissionGroupCreate";
import { PermissionGroupDetails as PermissionGroupDetailsComponent } from "./views/PermissionGroupDetails";
import PermissionGroupListComponent from "./views/PermissionGroupList";

const permissionGroupList: React.FC<RouteComponentProps<{}>> = ({ location }) => {
  const qs = parseQs(location.search.substr(1)) as any;
  const params: PermissionGroupListUrlQueryParams = asSortParams(
    qs,
    PermissionGroupListUrlSortField,
  );

  return <PermissionGroupListComponent params={params} />;
};

interface PermissionGroupDetailsRouteProps {
  id: string;
}

const PermissionGroupDetails: React.FC<RouteComponentProps<PermissionGroupDetailsRouteProps>> = ({
  match,
}) => {
  const qs = parseQs(location.search.substr(1)) as any;
  const params: PermissionGroupDetailsUrlQueryParams = asSortParams(qs, MembersListUrlSortField);

  return (
    <PermissionGroupDetailsComponent id={decodeURIComponent(match.params.id)} params={params} />
  );
};
const Component = () => {
  const intl = useIntl();

  return (
    <>
      <WindowTitle title={intl.formatMessage(sectionNames.permissionGroups)} />
      <Switch>
        <Route exact path={permissionGroupListPath} component={permissionGroupList} />
        <Route path={permissionGroupAddPath} component={PermissionGroupCreate} />
        <Route path={permissionGroupDetailsPath(":id")} component={PermissionGroupDetails} />
      </Switch>
    </>
  );
};

export default Component;
