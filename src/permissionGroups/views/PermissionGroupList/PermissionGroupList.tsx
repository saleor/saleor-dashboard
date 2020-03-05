import React from "react";
import { FormattedMessage } from "react-intl";

import useListSettings from "@saleor/hooks/useListSettings";
import useNavigator from "@saleor/hooks/useNavigator";
import useBulkActions from "@saleor/hooks/useBulkActions";

import usePaginator, {
  createPaginationState
} from "@saleor/hooks/usePaginator";
import Button from "@material-ui/core/Button";
import { configurationMenuUrl } from "@saleor/configuration";
import { maybe } from "@saleor/misc";
import { ListViews } from "@saleor/types";
import { getSortParams } from "@saleor/utils/sort";
import createSortHandler from "@saleor/utils/handlers/sortHandler";
import PermissionGroupBulkDeleteDialog from "@saleor/permissionGroups/components/permissionGroupBulkDeleteDialog";
import createDialogActionHandlers from "@saleor/utils/handlers/dialogActionHandlers";
import { buttonMessages } from "@saleor/intl";

import PermissionGroupListPage from "../../components/PermissionGroupListPage";

import { usePermissionGroupListQuery } from "../../queries";
import {
  permissionGroupListUrl,
  permissionGroupAddUrl,
  PermissionGroupListUrlQueryParams,
  permissionGroupDetailsUrl,
  PermissionGroupListUrlDialog
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
  const { data, loading } = usePermissionGroupListQuery({
    displayLoader: true,
    variables: queryVariables
  });

  const { isSelected, listElements, toggle, toggleAll } = useBulkActions(
    params.ids
  );
  const { loadNextPage, loadPreviousPage, pageInfo } = paginate(
    maybe(() => data.permissionGroups.pageInfo),
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

  return (
    <>
      <PermissionGroupListPage
        disabled={loading}
        settings={settings}
        pageInfo={pageInfo}
        toggle={toggle}
        toggleAll={toggleAll}
        isChecked={isSelected}
        selected={listElements.length}
        sort={getSortParams(params)}
        permissionGroups={maybe(() =>
          data.permissionGroups.edges.map(edge => edge.node)
        )}
        onAdd={() => navigate(permissionGroupAddUrl)}
        onBack={() => navigate(configurationMenuUrl)}
        onDelete={id => openModal("remove", { ids: [id] })}
        onNextPage={loadNextPage}
        onPreviousPage={loadPreviousPage}
        onUpdateListSettings={updateListSettings}
        onRowClick={id => () => navigate(permissionGroupDetailsUrl(id))}
        onSort={handleSort}
        toolbar={
          <Button
            color="primary"
            onClick={() => openModal("remove", { ids: listElements })}
          >
            <FormattedMessage {...buttonMessages.delete} />
          </Button>
        }
      />
      <PermissionGroupBulkDeleteDialog
        onConfirm={() => undefined} // TODO: Bulk mutation is not available
        confirmButtonState={"default"}
        quantity={listElements.length}
        open={params.action === "remove"}
        onClose={closeModal}
      />
    </>
  );
};

export default PermissionGroupList;
