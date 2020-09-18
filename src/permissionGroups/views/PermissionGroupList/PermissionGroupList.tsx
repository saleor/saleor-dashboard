import { configurationMenuUrl } from "@saleor/configuration";
import { PermissionGroupErrorFragment } from "@saleor/fragments/types/PermissionGroupErrorFragment";
import useListSettings from "@saleor/hooks/useListSettings";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import usePaginator, {
  createPaginationState
} from "@saleor/hooks/usePaginator";
import { getStringOrPlaceholder } from "@saleor/misc";
import PermissionGroupDeleteDialog from "@saleor/permissionGroups/components/PermissionGroupDeleteDialog";
import { usePermissionGroupDelete } from "@saleor/permissionGroups/mutations";
import { usePermissionGroupListQuery } from "@saleor/permissionGroups/queries";
import { PermissionGroupDelete } from "@saleor/permissionGroups/types/PermissionGroupDelete";
import { ListViews } from "@saleor/types";
import createDialogActionHandlers from "@saleor/utils/handlers/dialogActionHandlers";
import createSortHandler from "@saleor/utils/handlers/sortHandler";
import { getSortParams } from "@saleor/utils/sort";
import React from "react";
import { useIntl } from "react-intl";

import PermissionGroupListPage from "../../components/PermissionGroupListPage";
import {
  permissionGroupAddUrl,
  permissionGroupDetailsUrl,
  permissionGroupListUrl,
  PermissionGroupListUrlDialog,
  PermissionGroupListUrlQueryParams
} from "../../urls";
import { getSortQueryVariables } from "./sort";

interface PermissionGroupListProps {
  params: PermissionGroupListUrlQueryParams;
}

export const PermissionGroupList: React.FC<PermissionGroupListProps> = ({
  params
}) => {
  const navigate = useNavigator();
  const paginate = usePaginator();
  const notify = useNotifier();
  const intl = useIntl();
  const { updateListSettings, settings } = useListSettings(
    ListViews.STAFF_MEMBERS_LIST
  );

  const paginationState = createPaginationState(settings.rowNumber, params);
  const queryVariables = React.useMemo(
    () => ({
      ...paginationState,
      sort: getSortQueryVariables(params)
    }),
    [params]
  );
  const { data, loading, refetch } = usePermissionGroupListQuery({
    displayLoader: true,
    variables: queryVariables
  });

  const { loadNextPage, loadPreviousPage, pageInfo } = paginate(
    data?.permissionGroups.pageInfo,
    paginationState,
    params
  );

  const handleSort = createSortHandler(
    navigate,
    permissionGroupListUrl,
    params
  );

  const [openModal, closeModal] = createDialogActionHandlers<
    PermissionGroupListUrlDialog,
    PermissionGroupListUrlQueryParams
  >(navigate, permissionGroupListUrl, params);

  const permissionGroups = data?.permissionGroups?.edges.map(edge => edge.node);
  const [deleteError, setDeleteError] = React.useState<
    PermissionGroupErrorFragment
  >();

  const handleDeleteSuccess = (data: PermissionGroupDelete) => {
    if (data.permissionGroupDelete.errors.length === 0) {
      notify({
        status: "success",
        text: intl.formatMessage({
          defaultMessage: "Permission Group Deleted"
        })
      });
      refetch();
      setDeleteError(undefined);
      closeModal();
    } else {
      setDeleteError(data.permissionGroupDelete.errors[0]);
    }
  };

  const [permissionGroupDelete] = usePermissionGroupDelete({
    onCompleted: handleDeleteSuccess
  });
  return (
    <>
      <PermissionGroupListPage
        disabled={loading}
        settings={settings}
        pageInfo={pageInfo}
        sort={getSortParams(params)}
        permissionGroups={permissionGroups}
        onAdd={() => navigate(permissionGroupAddUrl)}
        onBack={() => navigate(configurationMenuUrl)}
        onDelete={id => openModal("remove", { id })}
        onNextPage={loadNextPage}
        onPreviousPage={loadPreviousPage}
        onUpdateListSettings={updateListSettings}
        onRowClick={id => () => navigate(permissionGroupDetailsUrl(id))}
        onSort={handleSort}
      />
      <PermissionGroupDeleteDialog
        onConfirm={() =>
          permissionGroupDelete({
            variables: {
              id: params.id
            }
          })
        }
        error={deleteError}
        name={getStringOrPlaceholder(
          permissionGroups?.find(group => group.id === params.id)?.name
        )}
        confirmButtonState={"default"}
        open={params.action === "remove"}
        onClose={closeModal}
      />
    </>
  );
};

export default PermissionGroupList;
