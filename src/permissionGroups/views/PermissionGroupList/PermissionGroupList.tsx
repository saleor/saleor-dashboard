import { usePermissionGroupListQuery } from "@dashboard/graphql";
import useListSettings from "@dashboard/hooks/useListSettings";
import useNavigator from "@dashboard/hooks/useNavigator";
import { usePaginationReset } from "@dashboard/hooks/usePaginationReset";
import usePaginator, {
  createPaginationState,
  PaginatorContext,
} from "@dashboard/hooks/usePaginator";
import { ListViews } from "@dashboard/types";
import createSortHandler from "@dashboard/utils/handlers/sortHandler";
import { mapEdgesToItems } from "@dashboard/utils/maps";
import { getSortParams } from "@dashboard/utils/sort";
import React from "react";

import PermissionGroupListPage from "../../components/PermissionGroupListPage";
import { permissionGroupListUrl, PermissionGroupListUrlQueryParams } from "../../urls";
import { getSortQueryVariables } from "./sort";

interface PermissionGroupListProps {
  params: PermissionGroupListUrlQueryParams;
}

export const PermissionGroupList: React.FC<PermissionGroupListProps> = ({ params }) => {
  const navigate = useNavigator();
  const { updateListSettings, settings } = useListSettings(ListViews.PERMISSION_GROUP_LIST);

  usePaginationReset(permissionGroupListUrl, params, settings.rowNumber);

  const paginationState = createPaginationState(settings.rowNumber, params);
  const queryVariables = React.useMemo(
    () => ({
      ...paginationState,
      sort: getSortQueryVariables(params),
    }),
    [params, settings.rowNumber],
  );
  const { data, loading } = usePermissionGroupListQuery({
    displayLoader: true,
    variables: queryVariables,
  });
  const paginationValues = usePaginator({
    pageInfo: data?.permissionGroups?.pageInfo,
    paginationState,
    queryString: params,
  });
  const handleSort = createSortHandler(navigate, permissionGroupListUrl, params);
  const permissionGroups = mapEdgesToItems(data?.permissionGroups) ?? [];

  return (
    <PaginatorContext.Provider value={paginationValues}>
      <PermissionGroupListPage
        disabled={loading}
        settings={settings}
        sort={getSortParams(params)}
        permissionGroups={permissionGroups}
        onUpdateListSettings={updateListSettings}
        onSort={handleSort}
      />
    </PaginatorContext.Provider>
  );
};

export default PermissionGroupList;
