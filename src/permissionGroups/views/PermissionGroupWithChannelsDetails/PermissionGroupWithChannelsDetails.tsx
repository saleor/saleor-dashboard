import { useUser } from "@dashboard/auth";
import useAppChannel from "@dashboard/components/AppLayout/AppChannelContext";
import { Button } from "@dashboard/components/Button";
import { DEFAULT_INITIAL_SEARCH_DATA } from "@dashboard/config";
import {
  usePermissionGroupWithChannelsDetailsQuery,
  usePermissionGroupWithChannelsUpdateMutation,
} from "@dashboard/graphql";
import useBulkActions from "@dashboard/hooks/useBulkActions";
import useNavigator from "@dashboard/hooks/useNavigator";
import useNotifier from "@dashboard/hooks/useNotifier";
import useShop from "@dashboard/hooks/useShop";
import useStateFromProps from "@dashboard/hooks/useStateFromProps";
import { commonMessages } from "@dashboard/intl";
import { extractMutationErrors } from "@dashboard/misc";
import MembersErrorDialog from "@dashboard/permissionGroups/components/MembersErrorDialog";
import {
  arePermissionsExceeded,
  channelsDiff,
  permissionsDiff,
  usersDiff,
} from "@dashboard/permissionGroups/utils";
import useStaffMemberSearch from "@dashboard/searches/useStaffMemberSearch";
import createDialogActionHandlers from "@dashboard/utils/handlers/dialogActionHandlers";
import createSortHandler from "@dashboard/utils/handlers/sortHandler";
import { mapEdgesToItems } from "@dashboard/utils/maps";
import { getSortParams } from "@dashboard/utils/sort";
import React from "react";
import { useIntl } from "react-intl";

import AssignMembersDialog from "../../components/AssignMembersDialog";
import {
  PermissionGroupWithChannelsDetailsPageFormData,
  PermissonGroupWithChannelsDetailsPage,
} from "../../components/PermissonGroupWithChannelsDetailsPage";
import UnassignMembersDialog from "../../components/UnassignMembersDialog";
import {
  permissionGroupDetailsUrl,
  PermissionGroupDetailsUrlDialog,
  PermissionGroupDetailsUrlQueryParams,
} from "../../urls";

interface PermissionGroupDetailsProps {
  id: string;
  params: PermissionGroupDetailsUrlQueryParams;
}

export const PermissionGroupWithChannelsDetails: React.FC<
  PermissionGroupDetailsProps
> = ({ id, params }) => {
  const navigate = useNavigator();
  const shop = useShop();
  const notify = useNotifier();
  const intl = useIntl();
  const user = useUser();

  const { data, loading, refetch } = usePermissionGroupWithChannelsDetailsQuery(
    {
      displayLoader: true,
      variables: { id, userId: user?.user.id },
    },
  );

  const { availableChannels } = useAppChannel();

  const [membersList, setMembersList] = useStateFromProps(
    data?.permissionGroup.users,
  );

  const {
    search,
    result: searchResult,
    loadMore,
  } = useStaffMemberSearch({
    variables: DEFAULT_INITIAL_SEARCH_DATA,
  });

  const { isSelected, listElements, toggle, toggleAll } = useBulkActions(
    params.ids,
  );

  const [permissionGroupUpdate, permissionGroupUpdateResult] =
    usePermissionGroupWithChannelsUpdateMutation({
      onCompleted: data => {
        if (data.permissionGroupUpdate.errors.length === 0) {
          notify({
            status: "success",
            text: intl.formatMessage(commonMessages.savedChanges),
          });
          refetch();
          closeModal();
        } else if (
          data.permissionGroupUpdate.errors.some(e => e.field === "removeUsers")
        ) {
          openModal("unassignError");
        }
      },
    });

  const [openModal, closeModal] = createDialogActionHandlers<
    PermissionGroupDetailsUrlDialog,
    PermissionGroupDetailsUrlQueryParams
  >(navigate, params => permissionGroupDetailsUrl(id, params), params);

  const handleSort = createSortHandler(
    navigate,
    params => permissionGroupDetailsUrl(id, params),
    params,
  );

  const unassignMembers = () => {
    setMembersList(membersList?.filter(m => !listElements.includes(m.id)));
    closeModal();
  };

  const isGroupEditable =
    (data?.user.editableGroups || []).filter(g => g.id === id).length > 0;

  const lastSourcesOfPermission = (data?.user.userPermissions || [])
    .filter(
      perm =>
        perm.sourcePermissionGroups.length === 1 &&
        perm.sourcePermissionGroups[0].id === id,
    )
    .map(perm => perm.code);

  const userPermissions = user?.user.userPermissions.map(p => p.code) || [];

  const permissions = (shop?.permissions || []).map(perm => ({
    ...perm,
    disabled: !userPermissions.includes(perm.code),
    lastSource: lastSourcesOfPermission.includes(perm.code),
  }));

  const permissionsExceeded = arePermissionsExceeded(
    data?.permissionGroup,
    user.user,
  );
  const disabled = loading || !isGroupEditable || permissionsExceeded;

  const handleSubmit = async (
    formData: PermissionGroupWithChannelsDetailsPageFormData,
  ) =>
    extractMutationErrors(
      permissionGroupUpdate({
        variables: {
          id,
          input: {
            name: formData.name,
            ...permissionsDiff(data?.permissionGroup, formData),
            ...usersDiff(data?.permissionGroup, formData),
            ...channelsDiff(data?.permissionGroup, formData),
            restrictedAccessToChannels: formData.hasRestrictedChannels,
          },
        },
      }),
    );

  return (
    <>
      <PermissonGroupWithChannelsDetailsPage
        permissionGroup={data?.permissionGroup}
        permissionsExceeded={permissionsExceeded}
        channels={availableChannels}
        members={membersList || []}
        onAssign={() => openModal("assign")}
        onUnassign={ids => openModal("unassign", { ids })}
        errors={
          permissionGroupUpdateResult?.data?.permissionGroupUpdate.errors ||
          ([] as any)
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
            variant="secondary"
            onClick={() => openModal("unassign", { ids: listElements })}
          >
            {intl.formatMessage({
              id: "15PiOX",
              defaultMessage: "Unassign",
              description: "button title",
            })}
          </Button>
        }
        onSort={handleSort}
      />
      <AssignMembersDialog
        loading={searchResult.loading}
        staffMembers={mapEdgesToItems(searchResult?.data?.search)}
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
            ...formData.filter(member => !membersList.includes(member)),
          ]);
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
