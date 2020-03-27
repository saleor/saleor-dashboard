import React, { useState } from "react";
import useNavigator from "@saleor/hooks/useNavigator";
import useShop from "@saleor/hooks/useShop";
import useBulkActions from "@saleor/hooks/useBulkActions";
import createDialogActionHandlers from "@saleor/utils/handlers/dialogActionHandlers";
import { maybe } from "@saleor/misc";
import { useIntl } from "react-intl";
import useNotifier from "@saleor/hooks/useNotifier";
import { DEFAULT_INITIAL_SEARCH_DATA } from "@saleor/config";
import { Button } from "@material-ui/core";
import { commonMessages } from "@saleor/intl";
import { getSortParams } from "@saleor/utils/sort";
import createSortHandler from "@saleor/utils/handlers/sortHandler";
import { permissionsDiff, usersDiff } from "@saleor/permissionGroups/utils";
import useStateFromProps from "@saleor/hooks/useStateFromProps";
import PermissionGroupDetailsPage from "../../components/PermissionGroupDetailsPage";
import AssignMembersDialog from "../../components/AssignMembersDialog";
import UnassignMembersDialog from "../../components/UnassignMembersDialog";
import { usePermissionGroupDetailsQuery } from "../../queries";
import { usePermissionGroupUpdate } from "../../mutations";
import useStaffMemberSearch from "../../../searches/useStaffMemberSearch";

import {
  permissionGroupDetailsUrl,
  PermissionGroupDetailsUrlQueryParams,
  PermissionGroupDetailsUrlDialog,
  permissionGroupListUrl
} from "../../urls";
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

  const [membersList, setMembersList] = useStateFromProps(
    data?.permissionGroup.users
  );

  const [membersModified, setMembersModified] = useState<boolean>(false);

  const { search, result: searchResult, loadMore } = useStaffMemberSearch({
    variables: DEFAULT_INITIAL_SEARCH_DATA
  });

  const handleUpdateSuccess = (data: PermissionGroupUpdate) => {
    if (data.permissionGroupUpdate.errors.length === 0) {
      notify({
        text: intl.formatMessage(commonMessages.savedChanges)
      });
      refetch();
      closeModal();
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

  return (
    <>
      <PermissionGroupDetailsPage
        permissionGroup={data?.permissionGroup}
        members={membersList}
        membersModified={membersModified}
        onBack={() => navigate(permissionGroupListUrl())}
        onAssign={() => openModal("assign")}
        onUnassign={ids => openModal("unassign", { ids })}
        errors={[]}
        onSubmit={formData =>
          permissionGroupUpdate({
            variables: {
              id,
              input: {
                name: formData.name,
                ...permissionsDiff(data?.permissionGroup, formData),
                ...usersDiff(data?.permissionGroup, formData)
              }
            }
          })
        }
        permissions={maybe(() => shop.permissions)}
        saveButtonBarState={permissionGroupUpdateResult.status}
        disabled={loading}
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
        staffMembers={maybe(() =>
          searchResult.data.search.edges.map(edge => edge.node)
        )}
        onSearchChange={search}
        onFetchMore={loadMore}
        disabled={false}
        hasMore={maybe(() => searchResult.data.search.pageInfo.hasNextPage)}
        initialSearch=""
        confirmButtonState={permissionGroupUpdateResult.status}
        errors={[]}
        open={params.action === "assign"}
        onClose={closeModal}
        onSubmit={formData => {
          setMembersList([...membersList, ...formData]);
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
    </>
  );
};

export default PermissionGroupDetails;
