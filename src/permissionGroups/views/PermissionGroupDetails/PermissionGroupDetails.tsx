import React from "react";
import useNavigator from "@saleor/hooks/useNavigator";
import useShop from "@saleor/hooks/useShop";
import useBulkActions from "@saleor/hooks/useBulkActions";
import createDialogActionHandlers from "@saleor/utils/handlers/dialogActionHandlers";
import { maybe } from "@saleor/misc";
import { useIntl } from "react-intl";
import useNotifier from "@saleor/hooks/useNotifier";
import { DEFAULT_INITIAL_SEARCH_DATA } from "@saleor/config";
import { Button } from "@material-ui/core";
import PermissionGroupDetailsPage from "../../components/PermissionGroupDetailsPage";
import AssignMembersDialog from "../../components/AssignMembersDialog";
import UnassignMembersDialog from "../../components/UnassignMembersDialog";
import { usePermissionGroupDetailsQuery } from "../../queries";
import {
  usePermissionGroupAssignUsers,
  usePermissionGroupUpdate,
  usePermissionGroupUnassignUsers
} from "../../mutations";
import useStaffMemberSearch from "../../../searches/useStaffMemberSearch";

import {
  permissionGroupDetailsUrl,
  PermissionGroupDetailsUrlQueryParams,
  PermissionGroupDetailsUrlDialog,
  permissionGroupListUrl
} from "../../urls";
import { PermissionGroupAssignUsers } from "../../types/PermissionGroupAssignUsers";
import { PermissionGroupUnassignUsers } from "../../types/PermissionGroupUnassignUsers";
import { PermissionGroupUpdate } from "../../types/PermissionGroupUpdate";

interface PermissionGroupDetailsProps {
  id: string;
  params: PermissionGroupDetailsUrlQueryParams;
}

export const PermissionGroupDetails: React.FC<PermissionGroupDetailsProps> = ({
  id,
  params
}) => {
  const navigate = useNavigator();
  const shop = useShop();
  const notify = useNotifier();
  const intl = useIntl();

  const { data, loading, refetch } = usePermissionGroupDetailsQuery({
    displayLoader: true,
    variables: { id }
  });

  const { search, result } = useStaffMemberSearch({
    variables: DEFAULT_INITIAL_SEARCH_DATA
  });

  const handleAssignUsersSuccess = (data: PermissionGroupAssignUsers) => {
    if (data.permissionGroupAssignUsers.errors.length === 0) {
      notify({
        text: intl.formatMessage({
          defaultMessage: "Users assigned"
        })
      });
      refetch();
      closeModal();
    }
  };

  const handleUnassignUsersSuccess = (data: PermissionGroupUnassignUsers) => {
    if (data.permissionGroupUnassignUsers.errors.length === 0) {
      notify({
        text: intl.formatMessage({
          defaultMessage: "Users unassigned"
        })
      });
      refetch();
      closeModal();
    }
  };

  const handleUpdateSuccess = (data: PermissionGroupUpdate) => {
    if (data.permissionGroupUpdate.errors.length === 0) {
      notify({
        text: intl.formatMessage({
          defaultMessage: "Permission group modified"
        })
      });
      refetch();
      closeModal();
    }
  };

  const { isSelected, listElements, toggle, toggleAll } = useBulkActions(
    params.ids
  );

  const [
    permissionGroupAssignUsers,
    permissionGroupAssignUsersResult
  ] = usePermissionGroupAssignUsers({
    onCompleted: handleAssignUsersSuccess
  });

  const [
    permissionGroupUnassignUsers,
    permissionGroupUnassignUsersResult
  ] = usePermissionGroupUnassignUsers({
    onCompleted: handleUnassignUsersSuccess
  });

  const [
    permissionGroupUpdate,
    permissionGroupUpdateResult
  ] = usePermissionGroupUpdate({
    onCompleted: handleUpdateSuccess
  });

  const assignDialogErrors = maybe(
    () =>
      permissionGroupAssignUsersResult.data.permissionGroupAssignUsers.errors,
    []
  );
  const [openModal, closeModal] = createDialogActionHandlers<
    PermissionGroupDetailsUrlDialog,
    PermissionGroupDetailsUrlQueryParams
  >(navigate, params => permissionGroupDetailsUrl(id, params), params);

  return (
    <>
      <PermissionGroupDetailsPage
        permissionGroup={maybe(() => data.permissionGroup)}
        users={maybe(() => data.permissionGroup.users)}
        onBack={() => navigate(permissionGroupListUrl())}
        onAssign={() => openModal("assign")}
        onUnassign={ids => openModal("unassign", { ids })}
        errors={[]}
        onSubmit={data =>
          permissionGroupUpdate({
            variables: {
              id,
              input: { name: data.name, permissions: data.permissions }
            }
          })
        }
        canEditStatus={true}
        permissions={maybe(() => shop.permissions)}
        saveButtonBarState={permissionGroupUpdateResult.status}
        disabled={loading}
        toggle={toggle}
        toggleAll={toggleAll}
        isChecked={isSelected}
        selected={listElements.length}
        toolbar={
          <Button
            color="primary"
            onClick={() => openModal("unassign", { ids: listElements })}
          >
            Unassign
          </Button>
        }
      />
      <AssignMembersDialog
        loading={result.loading}
        staffMembers={maybe(() =>
          result.data.search.edges.map(edge => edge.node)
        )}
        onFetch={search}
        confirmButtonState={permissionGroupAssignUsersResult.status}
        errors={assignDialogErrors}
        open={params.action === "assign"}
        onClose={closeModal}
        onSubmit={data =>
          permissionGroupAssignUsers({
            variables: {
              id,
              input: { users: data.map(node => node.id) }
            }
          })
        }
      />
      <UnassignMembersDialog
        onConfirm={() =>
          permissionGroupUnassignUsers({
            variables: {
              id,
              input: { users: listElements }
            }
          })
        }
        confirmButtonState={permissionGroupUnassignUsersResult.status}
        quantity={listElements.length}
        open={params.action === "unassign"}
        onClose={closeModal}
      />
    </>
  );
};

export default PermissionGroupDetails;
