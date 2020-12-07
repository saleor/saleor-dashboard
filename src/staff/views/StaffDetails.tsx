import DialogContentText from "@material-ui/core/DialogContentText";
import ActionDialog from "@saleor/components/ActionDialog";
import NotFoundPage from "@saleor/components/NotFoundPage";
import { WindowTitle } from "@saleor/components/WindowTitle";
import { DEFAULT_INITIAL_SEARCH_DATA } from "@saleor/config";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import useUser from "@saleor/hooks/useUser";
import { commonMessages } from "@saleor/intl";
import { getStringOrPlaceholder } from "@saleor/misc";
import usePermissionGroupSearch from "@saleor/searches/usePermissionGroupSearch";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import StaffDetailsPage, {
  StaffDetailsFormData
} from "../components/StaffDetailsPage/StaffDetailsPage";
import StaffPasswordResetDialog from "../components/StaffPasswordResetDialog";
import {
  useChangeStaffPassword,
  useStaffAvatarDeleteMutation,
  useStaffAvatarUpdateMutation,
  useStaffMemberDeleteMutation,
  useStaffMemberUpdateMutation
} from "../mutations";
import { useStaffMemberDetailsQuery } from "../queries";
import {
  staffListUrl,
  staffMemberDetailsUrl,
  StaffMemberDetailsUrlQueryParams
} from "../urls";
import { groupsDiff } from "../utils";

interface OrderListProps {
  id: string;
  params: StaffMemberDetailsUrlQueryParams;
}

export const StaffDetails: React.FC<OrderListProps> = ({ id, params }) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const user = useUser();
  const intl = useIntl();
  const handleBack = () => navigate(staffListUrl());

  const { data: staffDetailsQueryData, loading } = useStaffMemberDetailsQuery({
    displayLoader: true,
    variables: { id }
  });

  const staffMember = staffDetailsQueryData?.user;

  if (staffMember === null) {
    return <NotFoundPage onBack={handleBack} />;
  }

  const isUserSameAsViewer = user.user?.id === staffDetailsQueryData.user?.id;

  const closeModal = () =>
    navigate(
      staffMemberDetailsUrl(id, {
        ...params,
        action: undefined
      })
    );

  const [changePassword, changePasswordOpts] = useChangeStaffPassword({
    onCompleted: data => {
      if (data.passwordChange.errors.length === 0) {
        notify({
          status: "success",
          text: intl.formatMessage(commonMessages.savedChanges)
        });
        closeModal();
      }
    }
  });

  const {
    loadMore: loadMorePermissionGroups,
    search: searchPermissionGroups,
    result: searchPermissionGroupsOpts
  } = usePermissionGroupSearch({
    variables: DEFAULT_INITIAL_SEARCH_DATA
  });

  const [
    staffMemberUpdate,
    staffMemberUpdateOpts
  ] = useStaffMemberUpdateMutation({
    onCompleted: data => {
      if (data.staffUpdate.errors.length === 0) {
        notify({
          status: "success",
          text: intl.formatMessage(commonMessages.savedChanges)
        });
        navigate(staffMemberDetailsUrl(data.staffUpdate.user.id));
      }
    }
  });

  const [
    staffMemberDelete,
    staffMemberDeleteOpts
  ] = useStaffMemberDeleteMutation({
    onCompleted: data => {
      if (data.staffDelete.errors.length === 0) {
        notify({
          status: "success",
          text: intl.formatMessage(commonMessages.savedChanges)
        });
        navigate(staffListUrl());
      }
    }
  });

  const [staffAvatarUpdate] = useStaffAvatarUpdateMutation({
    onCompleted: data => {
      if (data.userAvatarUpdate.errors.length === 0) {
        notify({
          status: "success",
          text: intl.formatMessage(commonMessages.savedChanges)
        });
        navigate(staffMemberDetailsUrl(id));
      }
    }
  });

  const [
    staffAvatarDelete,
    staffAvatarDeleteOpts
  ] = useStaffAvatarDeleteMutation({
    onCompleted: data => {
      if (data.userAvatarDelete.errors.length === 0) {
        notify({
          status: "success",
          text: intl.formatMessage(commonMessages.savedChanges)
        });
        navigate(staffMemberDetailsUrl(id));
      }
    }
  });

  const handleStaffMemberUpdate = async (formData: StaffDetailsFormData) => {
    staffMemberUpdate({
      variables: {
        id,
        input: {
          email: formData.email,
          firstName: formData.firstName,
          isActive: formData.isActive,
          lastName: formData.lastName,
          ...groupsDiff(staffDetailsQueryData?.user, formData)
        }
      }
    });
  };

  const handleStaffMemberDelete = async () => {
    staffMemberDelete({
      variables: { id }
    });
  };

  const handleStaffAvatarDelete = async () => {
    staffAvatarDelete({
      variables: { id }
    });
  };

  const handleStaffAvatarUpdate = async (file: File) => {
    staffAvatarUpdate({
      variables: {
        image: file
      }
    });
  };

  return (
    <>
      <WindowTitle title={getStringOrPlaceholder(staffMember?.email)} />
      <StaffDetailsPage
        errors={staffMemberUpdateOpts?.data?.staffUpdate?.errors || []}
        canEditAvatar={isUserSameAsViewer}
        canEditPreferences={isUserSameAsViewer}
        canEditStatus={!isUserSameAsViewer}
        canRemove={!isUserSameAsViewer}
        disabled={loading}
        onBack={handleBack}
        initialSearch=""
        onChangePassword={() =>
          navigate(
            staffMemberDetailsUrl(id, {
              action: "change-password"
            })
          )
        }
        onDelete={() =>
          navigate(
            staffMemberDetailsUrl(id, {
              action: "remove"
            })
          )
        }
        onSubmit={handleStaffMemberUpdate}
        onImageUpload={handleStaffAvatarUpdate}
        onImageDelete={() =>
          navigate(
            staffMemberDetailsUrl(id, {
              action: "remove-avatar"
            })
          )
        }
        availablePermissionGroups={searchPermissionGroupsOpts.data?.search.edges.map(
          edge => edge.node
        )}
        staffMember={staffMember}
        saveButtonBarState={staffMemberUpdateOpts.status}
        fetchMorePermissionGroups={{
          hasMore: searchPermissionGroupsOpts.data?.search.pageInfo.hasNextPage,
          loading: searchPermissionGroupsOpts.loading,
          onFetchMore: loadMorePermissionGroups
        }}
        onSearchChange={searchPermissionGroups}
      />
      <ActionDialog
        open={params.action === "remove"}
        title={intl.formatMessage({
          defaultMessage: "delete Staff User",
          description: "dialog header"
        })}
        confirmButtonState={staffMemberDeleteOpts.status}
        variant="delete"
        onClose={closeModal}
        onConfirm={handleStaffMemberDelete}
      >
        <DialogContentText>
          <FormattedMessage
            defaultMessage="Are you sure you want to delete {email} from staff members?"
            values={{
              email: getStringOrPlaceholder(staffDetailsQueryData.user?.email)
            }}
          />
        </DialogContentText>
      </ActionDialog>
      <ActionDialog
        open={params.action === "remove-avatar"}
        title={intl.formatMessage({
          defaultMessage: "Delete Staff User Avatar",
          description: "dialog header"
        })}
        confirmButtonState={staffAvatarDeleteOpts.status}
        variant="delete"
        onClose={closeModal}
        onConfirm={handleStaffAvatarDelete}
      >
        <DialogContentText>
          <FormattedMessage
            defaultMessage="Are you sure you want to remove {email} avatar?"
            values={{
              email: (
                <strong>
                  {getStringOrPlaceholder(staffDetailsQueryData.user?.email)}
                </strong>
              )
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
            variables: data
          })
        }
      />
    </>
  );
};

export default StaffDetails;
