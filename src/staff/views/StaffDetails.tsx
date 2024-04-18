// @ts-strict-ignore
import { useUser } from "@dashboard/auth";
import ActionDialog from "@dashboard/components/ActionDialog";
import NotFoundPage from "@dashboard/components/NotFoundPage";
import { hasPermissions } from "@dashboard/components/RequirePermissions";
import { WindowTitle } from "@dashboard/components/WindowTitle";
import { DEFAULT_INITIAL_SEARCH_DATA } from "@dashboard/config";
import { PermissionEnum, useStaffMemberDetailsQuery } from "@dashboard/graphql";
import useNavigator from "@dashboard/hooks/useNavigator";
import { extractMutationErrors, getStringOrPlaceholder } from "@dashboard/misc";
import usePermissionGroupSearch from "@dashboard/searches/usePermissionGroupSearch";
import { mapEdgesToItems } from "@dashboard/utils/maps";
import { DialogContentText } from "@material-ui/core";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import StaffDetailsPage, {
  StaffDetailsFormData,
} from "../components/StaffDetailsPage/StaffDetailsPage";
import StaffPasswordResetDialog from "../components/StaffPasswordResetDialog";
import { useProfileOperations, useStaffUserOperations } from "../hooks";
import { staffListUrl, staffMemberDetailsUrl, StaffMemberDetailsUrlQueryParams } from "../urls";
import { groupsDiff } from "../utils";

interface OrderListProps {
  id: string;
  params: StaffMemberDetailsUrlQueryParams;
}

export const StaffDetails: React.FC<OrderListProps> = ({ id, params }) => {
  const navigate = useNavigator();
  const user = useUser();
  const intl = useIntl();
  const closeModal = () =>
    navigate(
      staffMemberDetailsUrl(id, {
        ...params,
        action: undefined,
      }),
    );
  const isUserSameAsViewer = user.user?.id === id;
  const { data, loading, refetch } = useStaffMemberDetailsQuery({
    displayLoader: true,
    variables: { id },
    skip: isUserSameAsViewer,
  });
  const { deleteResult, deleteStaffMember, updateStaffMember, updateStaffMemberOpts } =
    useStaffUserOperations();
  const {
    updateUserAccount,
    updateUserAccountOpts,
    changePassword,
    changePasswordOpts,
    deleteAvatarResult,
    deleteUserAvatar,
    updateUserAvatar,
  } = useProfileOperations({ closeModal, id, refetch });
  const staffMember = isUserSameAsViewer ? user.user : data?.user;
  const hasManageStaffPermission = hasPermissions(user.user.userPermissions, [
    PermissionEnum.MANAGE_STAFF,
  ]);
  const {
    loadMore: loadMorePermissionGroups,
    search: searchPermissionGroups,
    result: searchPermissionGroupsOpts,
  } = usePermissionGroupSearch({
    variables: DEFAULT_INITIAL_SEARCH_DATA,
    skip: !hasManageStaffPermission,
  });

  if (staffMember === null) {
    return <NotFoundPage backHref={staffListUrl()} />;
  }

  const handleStaffUpdate = (formData: StaffDetailsFormData) =>
    extractMutationErrors(
      updateStaffMember({
        variables: {
          id,
          input: {
            email: formData.email,
            firstName: formData.firstName,
            isActive: formData.isActive,
            lastName: formData.lastName,
            ...(hasManageStaffPermission ? groupsDiff(data?.user, formData) : {}),
          },
        },
      }),
    );
  const handleUserUpdate = (formData: StaffDetailsFormData) =>
    extractMutationErrors(
      updateUserAccount({
        variables: {
          input: {
            firstName: formData.firstName,
            lastName: formData.lastName,
          },
        },
      }),
    );

  return (
    <>
      <WindowTitle title={getStringOrPlaceholder(staffMember?.email)} />
      <StaffDetailsPage
        errors={updateStaffMemberOpts?.data?.staffUpdate?.errors || []}
        canEditAvatar={isUserSameAsViewer}
        canEditPreferences={isUserSameAsViewer}
        canEditStatus={!isUserSameAsViewer}
        canRemove={!isUserSameAsViewer}
        disabled={loading}
        initialSearch=""
        onChangePassword={() =>
          navigate(
            staffMemberDetailsUrl(id, {
              action: "change-password",
            }),
          )
        }
        onDelete={() =>
          navigate(
            staffMemberDetailsUrl(id, {
              action: "remove",
            }),
          )
        }
        onSubmit={isUserSameAsViewer ? handleUserUpdate : handleStaffUpdate}
        onImageUpload={file =>
          updateUserAvatar({
            variables: {
              image: file,
            },
          })
        }
        onImageDelete={() =>
          navigate(
            staffMemberDetailsUrl(id, {
              action: "remove-avatar",
            }),
          )
        }
        availablePermissionGroups={mapEdgesToItems(searchPermissionGroupsOpts?.data?.search)}
        staffMember={staffMember}
        saveButtonBarState={
          isUserSameAsViewer ? updateUserAccountOpts.status : updateStaffMemberOpts.status
        }
        fetchMorePermissionGroups={{
          hasMore: searchPermissionGroupsOpts.data?.search?.pageInfo.hasNextPage,
          loading: searchPermissionGroupsOpts.loading,
          onFetchMore: loadMorePermissionGroups,
        }}
        onSearchChange={searchPermissionGroups}
      />
      <ActionDialog
        open={params.action === "remove"}
        title={intl.formatMessage({
          id: "GhXwO/",
          defaultMessage: "delete Staff User",
          description: "dialog header",
        })}
        confirmButtonState={deleteResult.status}
        variant="delete"
        onClose={closeModal}
        onConfirm={() =>
          deleteStaffMember({
            variables: { id },
          })
        }
      >
        <DialogContentText>
          <FormattedMessage
            id="gxPjIQ"
            defaultMessage="Are you sure you want to delete {email} from staff members?"
            values={{
              email: getStringOrPlaceholder(data?.user?.email),
            }}
          />
        </DialogContentText>
      </ActionDialog>
      <ActionDialog
        open={params.action === "remove-avatar"}
        title={intl.formatMessage({
          id: "VKWPBf",
          defaultMessage: "Delete Staff User Avatar",
          description: "dialog header",
        })}
        confirmButtonState={deleteAvatarResult.status}
        variant="delete"
        onClose={closeModal}
        onConfirm={deleteUserAvatar}
      >
        <DialogContentText>
          <FormattedMessage
            id="fzpXvv"
            defaultMessage="Are you sure you want to remove {email} avatar?"
            values={{
              email: <strong>{getStringOrPlaceholder(data?.user?.email)}</strong>,
            }}
          />
        </DialogContentText>
      </ActionDialog>
      <StaffPasswordResetDialog
        confirmButtonState={changePasswordOpts.status}
        errors={changePasswordOpts?.data?.passwordChange?.errors || []}
        open={params.action === "change-password"}
        onClose={closeModal}
        onSubmit={data =>
          changePassword({
            variables: data,
          })
        }
      />
    </>
  );
};

export default StaffDetails;
