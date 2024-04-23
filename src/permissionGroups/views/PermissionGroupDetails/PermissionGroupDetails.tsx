import { useUser } from "@dashboard/auth";
import useAppChannel from "@dashboard/components/AppLayout/AppChannelContext";
import { Button } from "@dashboard/components/Button";
import { DEFAULT_INITIAL_SEARCH_DATA } from "@dashboard/config";
import {
  PermissionGroupDetailsQuery,
  PermissionGroupErrorFragment,
  usePermissionGroupDeleteMutation,
  usePermissionGroupDetailsQuery,
  usePermissionGroupUpdateMutation,
} from "@dashboard/graphql";
import useBulkActions from "@dashboard/hooks/useBulkActions";
import useNavigator from "@dashboard/hooks/useNavigator";
import useNotifier from "@dashboard/hooks/useNotifier";
import useShop from "@dashboard/hooks/useShop";
import useStateFromProps from "@dashboard/hooks/useStateFromProps";
import { commonMessages } from "@dashboard/intl";
import { extractMutationErrors, getStringOrPlaceholder } from "@dashboard/misc";
import MembersErrorDialog from "@dashboard/permissionGroups/components/MembersErrorDialog";
import PermissionGroupDeleteDialog from "@dashboard/permissionGroups/components/PermissionGroupDeleteDialog";
import useStaffMemberSearch from "@dashboard/searches/useStaffMemberSearch";
import createDialogActionHandlers from "@dashboard/utils/handlers/dialogActionHandlers";
import createSortHandler from "@dashboard/utils/handlers/sortHandler";
import { mapEdgesToItems } from "@dashboard/utils/maps";
import { getSortParams } from "@dashboard/utils/sort";
import React from "react";
import { useIntl } from "react-intl";

import AssignMembersDialog from "../../components/AssignMembersDialog";
import {
  PermissionGroupDetailsPage,
  PermissionGroupDetailsPageFormData,
} from "../../components/PermissionGroupDetailsPage";
import UnassignMembersDialog from "../../components/UnassignMembersDialog";
import {
  permissionGroupDetailsUrl,
  PermissionGroupDetailsUrlDialog,
  PermissionGroupDetailsUrlQueryParams,
  permissionGroupListUrl,
} from "../../urls";
import {
  arePermissionsExceeded,
  channelsDiff,
  checkIfUserBelongToPermissionGroup,
  permissionsDiff,
  usersDiff,
} from "../../utils";

interface PermissionGroupDetailsProps {
  id: string;
  params: PermissionGroupDetailsUrlQueryParams;
}

type Members = NonNullable<
  NonNullable<PermissionGroupDetailsQuery["permissionGroup"]>["users"]
>;

export const PermissionGroupDetails: React.FC<PermissionGroupDetailsProps> = ({
  id,
  params,
}) => {
  const navigate = useNavigator();
  const shop = useShop();
  const notify = useNotifier();
  const intl = useIntl();
  const user = useUser();

  const { data, loading, refetch } = usePermissionGroupDetailsQuery({
    displayLoader: true,
    variables: { id, userId: user?.user?.id ?? "" },
  });

  const { availableChannels } = useAppChannel(false);

  const [membersList, setMembersList] = useStateFromProps<Members>(
    data?.permissionGroup?.users ?? [],
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
    usePermissionGroupUpdateMutation({
      onCompleted: updatedData => {
        if (updatedData?.permissionGroupUpdate?.errors?.length === 0) {
          notify({
            status: "success",
            text: intl.formatMessage(commonMessages.savedChanges),
          });

          // When user belong to editedd permission group refetch user details
          // as they are root of user accessible channels
          if (
            checkIfUserBelongToPermissionGroup(
              data?.permissionGroup,
              user?.user?.id ?? "",
            ) &&
            user.refetchUser
          ) {
            user.refetchUser();
          }

          refetch();
          closeModal();
        } else if (
          updatedData?.permissionGroupUpdate?.errors.some(
            e => e.field === "removeUsers",
          )
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

  const [deleteError, setDeleteError] =
    React.useState<PermissionGroupErrorFragment>();

  const [permissionGroupDelete, permissionGroupDeleteOps] =
    usePermissionGroupDeleteMutation({
      onCompleted: data => {
        if (data?.permissionGroupDelete?.errors?.length === 0) {
          notify({
            status: "success",
            text: intl.formatMessage({
              id: "DovGIa",
              defaultMessage: "Permission Group Deleted",
            }),
          });
          navigate(permissionGroupListUrl());
        } else {
          setDeleteError(data?.permissionGroupDelete?.errors?.[0]);
        }
      },
    });

  const unassignMembers = () => {
    setMembersList(
      membersList?.filter(m => !listElements.includes(m.id)) ?? [],
    );
    closeModal();
  };

  const isGroupEditable =
    (data?.user?.editableGroups || []).filter(g => g.id === id).length > 0 &&
    data?.permissionGroup?.userCanManage;

  const lastSourcesOfPermission = (data?.user?.userPermissions || [])
    .filter(
      perm =>
        perm.sourcePermissionGroups?.length === 1 &&
        perm.sourcePermissionGroups?.[0].id === id,
    )
    .map(perm => perm.code);

  const userPermissions = user?.user?.userPermissions?.map(p => p.code) || [];

  const permissions = (shop?.permissions || []).map(perm => ({
    ...perm,
    disabled: !userPermissions.includes(perm.code),
    lastSource: lastSourcesOfPermission.includes(perm.code),
  }));

  const permissionsExceeded = arePermissionsExceeded(
    data?.permissionGroup,
    user?.user,
  );

  const isLoading = loading || permissionGroupUpdateResult.loading;
  const disabled = isLoading || !isGroupEditable || permissionsExceeded;

  const handleSubmit = async (formData: PermissionGroupDetailsPageFormData) =>
    extractMutationErrors(
      permissionGroupUpdate({
        variables: {
          id,
          input: {
            name: formData.name,
            ...permissionsDiff(data?.permissionGroup, formData),
            ...usersDiff(data?.permissionGroup, formData),
            ...channelsDiff(
              data?.permissionGroup,
              formData,
              availableChannels,
              !!isGroupEditable,
            ),
            restrictedAccessToChannels: !formData.hasAllChannels,
          },
        },
      }),
    );

  return (
    <>
      <PermissionGroupDetailsPage
        permissionGroup={data?.permissionGroup}
        permissionsExceeded={permissionsExceeded}
        isUserAbleToEditChannels={!!isGroupEditable}
        channels={availableChannels}
        members={membersList}
        onAssign={() => openModal("assign")}
        onUnassign={ids => openModal("unassign", { ids })}
        onDelete={() => openModal("remove")}
        errors={
          permissionGroupUpdateResult?.data?.permissionGroupUpdate?.errors ?? []
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
            data-test-id="unassign-members-button"
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
        staffMembers={mapEdgesToItems(searchResult?.data?.search) ?? []}
        onSearchChange={search}
        onFetchMore={loadMore}
        disabled={disabled}
        hasMore={searchResult?.data?.search?.pageInfo?.hasNextPage ?? false}
        initialSearch=""
        confirmButtonState={permissionGroupUpdateResult.status}
        open={params.action === "assign"}
        onClose={closeModal}
        onSubmit={formData => {
          setMembersList([...(membersList ?? []), ...formData] as Members);
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

      <PermissionGroupDeleteDialog
        onConfirm={() =>
          permissionGroupDelete({
            variables: {
              id: data?.permissionGroup?.id ?? "",
            },
          })
        }
        error={deleteError}
        name={getStringOrPlaceholder(data?.permissionGroup?.name)}
        confirmButtonState={permissionGroupDeleteOps.status}
        open={params.action === "remove"}
        onClose={closeModal}
      />
    </>
  );
};
