import { Button } from "@material-ui/core";
import { DEFAULT_INITIAL_SEARCH_DATA } from "@saleor/config";
import useBulkActions from "@saleor/hooks/useBulkActions";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import useShop from "@saleor/hooks/useShop";
import useStateFromProps from "@saleor/hooks/useStateFromProps";
import useUser from "@saleor/hooks/useUser";
import { commonMessages } from "@saleor/intl";
import MembersErrorDialog from "@saleor/permissionGroups/components/MembersErrorDialog";
import {
  arePermissionsExceeded,
  permissionsDiff,
  usersDiff
} from "@saleor/permissionGroups/utils";
import useStaffMemberSearch from "@saleor/searches/useStaffMemberSearch";
import createDialogActionHandlers from "@saleor/utils/handlers/dialogActionHandlers";
import createSortHandler from "@saleor/utils/handlers/sortHandler";
import { getSortParams } from "@saleor/utils/sort";
import React, { useState } from "react";
import { useIntl } from "react-intl";

import AssignMembersDialog from "../../components/AssignMembersDialog";
import PermissionGroupDetailsPage, {
  PermissionGroupDetailsPageFormData
} from "../../components/PermissionGroupDetailsPage";
import UnassignMembersDialog from "../../components/UnassignMembersDialog";
import { usePermissionGroupUpdate } from "../../mutations";
import { usePermissionGroupDetailsQuery } from "../../queries";
import { PermissionGroupUpdate } from "../../types/PermissionGroupUpdate";
import {
  permissionGroupDetailsUrl,
  PermissionGroupDetailsUrlDialog,
  PermissionGroupDetailsUrlQueryParams,
  permissionGroupListUrl
} from "../../urls";

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
  const user = useUser();

  const { data, loading, refetch } = usePermissionGroupDetailsQuery({
    displayLoader: true,
    variables: { id, userId: user?.user.id }
  });

  const [membersList, setMembersList] = useStateFromProps(
    data?.permissionGroup.users
  );

  const [membersModified, setMembersModified] = useState(false);

  const { search, result: searchResult, loadMore } = useStaffMemberSearch({
    variables: DEFAULT_INITIAL_SEARCH_DATA
  });

  const handleUpdateSuccess = (data: PermissionGroupUpdate) => {
    if (data.permissionGroupUpdate.errors.length === 0) {
      notify({
        status: "success",
        text: intl.formatMessage(commonMessages.savedChanges)
      });
      refetch();
      closeModal();
    } else if (
      data.permissionGroupUpdate.errors.some(e => e.field === "removeUsers")
    ) {
      openModal("unassignError");
    }
  };

  const { isSelected, listElements, toggle, toggleAll } = useBulkActions(
    params.ids
  );

  const [
    permissionGroupUpdate,
    permissionGroupUpdateResult
  ] = usePermissionGroupUpdate({
    onCompleted: handleUpdateSuccess
  });

  const [openModal, closeModal] = createDialogActionHandlers<
    PermissionGroupDetailsUrlDialog,
    PermissionGroupDetailsUrlQueryParams
  >(navigate, params => permissionGroupDetailsUrl(id, params), params);

  const handleSort = createSortHandler(
    navigate,
    params => permissionGroupDetailsUrl(id, params),
    params
  );

  const unassignMembers = () => {
    setMembersList(membersList?.filter(m => !listElements.includes(m.id)));
    setMembersModified(true);
    closeModal();
  };

  const isGroupEditable =
    (data?.user.editableGroups || []).filter(g => g.id === id).length > 0;

  const lastSourcesOfPermission = (data?.user.userPermissions || [])
    .filter(
      perm =>
        perm.sourcePermissionGroups.length === 1 &&
        perm.sourcePermissionGroups[0].id === id
    )
    .map(perm => perm.code);

  const userPermissions = user?.user.userPermissions.map(p => p.code) || [];

  const permissions = (shop?.permissions || []).map(perm => ({
    ...perm,
    disabled: !userPermissions.includes(perm.code),
    lastSource: lastSourcesOfPermission.includes(perm.code)
  }));

  const permissionsExceeded = arePermissionsExceeded(
    data?.permissionGroup,
    user.user
  );
  const disabled = loading || !isGroupEditable || permissionsExceeded;

  const handleSubmit = async (formData: PermissionGroupDetailsPageFormData) => {
    const result = await permissionGroupUpdate({
      variables: {
        id,
        input: {
          name: formData.name,
          ...permissionsDiff(data?.permissionGroup, formData),
          ...usersDiff(data?.permissionGroup, formData)
        }
      }
    });

    return result.data.permissionGroupUpdate.errors;
  };

  return (
    <>
      <PermissionGroupDetailsPage
        permissionGroup={data?.permissionGroup}
        permissionsExceeded={permissionsExceeded}
        members={membersList || []}
        membersModified={membersModified}
        onBack={() => navigate(permissionGroupListUrl())}
        onAssign={() => openModal("assign")}
        onUnassign={ids => openModal("unassign", { ids })}
        errors={
          permissionGroupUpdateResult?.data?.permissionGroupUpdate.errors || []
        }
        onSubmit={handleSubmit}
        permissions={permissions}
        saveButtonBarState={permissionGroupUpdateResult.status}
        disabled={disabled}
        toggle={toggle}
        toggleAll={toggleAll}
        isChecked={isSelected}
        selected={listElements.length}
        sort={getSortParams(params)}
        toolbar={
          <Button
            color="primary"
            onClick={() => openModal("unassign", { ids: listElements })}
          >
            {intl.formatMessage({
              defaultMessage: "Unassign",
              description: "button title"
            })}
          </Button>
        }
        onSort={handleSort}
      />
      <AssignMembersDialog
        loading={searchResult.loading}
        staffMembers={searchResult?.data?.search.edges.map(edge => edge.node)}
        onSearchChange={search}
        onFetchMore={loadMore}
        disabled={disabled}
        hasMore={searchResult?.data?.search.pageInfo.hasNextPage}
        initialSearch=""
        confirmButtonState={permissionGroupUpdateResult.status}
        open={params.action === "assign"}
        onClose={closeModal}
        onSubmit={formData => {
          setMembersList([
            ...membersList,
            ...formData.filter(member => !membersList.includes(member))
          ]);
          setMembersModified(true);
          closeModal();
        }}
      />
      <UnassignMembersDialog
        onConfirm={unassignMembers}
        confirmButtonState={permissionGroupUpdateResult.status}
        quantity={listElements.length}
        open={params.action === "unassign"}
        onClose={closeModal}
      />
      <MembersErrorDialog
        onConfirm={closeModal}
        confirmButtonState={permissionGroupUpdateResult.status}
        open={params.action === "unassignError"}
        onClose={closeModal}
      />
    </>
  );
};

export default PermissionGroupDetails;
