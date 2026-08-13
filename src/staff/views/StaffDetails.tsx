// @ts-strict-ignore
import { useUser } from "@dashboard/auth/useUser";
import { getNewPasswordResetRedirectUrl } from "@dashboard/auth/utils";
import ActionDialog from "@dashboard/components/ActionDialog";
import NotFoundPage from "@dashboard/components/NotFoundPage";
import { hasPermissions } from "@dashboard/components/RequirePermissions";
import { WindowTitle } from "@dashboard/components/WindowTitle";
import { DEFAULT_INITIAL_SEARCH_DATA } from "@dashboard/config";
import { customerUrl } from "@dashboard/customers/urls";
import {
  PermissionEnum,
  useRequestPasswordResetMutation,
  useStaffMemberDetailsQuery,
  useStaffMemberUpdateMutation,
} from "@dashboard/graphql";
import useNavigator from "@dashboard/hooks/useNavigator";
import { useNotifier } from "@dashboard/hooks/useNotifier";
import { extractMutationErrors, getStringOrPlaceholder } from "@dashboard/misc";
import usePermissionGroupSearch from "@dashboard/searches/usePermissionGroupSearch";
import { isStaffInvitePending } from "@dashboard/staff/staffMemberStatus";
import { mapEdgesToItems } from "@dashboard/utils/maps";
import { FormattedMessage, useIntl } from "react-intl";

import {
  type StaffDetailsFormData,
  StaffDetailsPage,
} from "../components/StaffDetailsPage/StaffDetailsPage";
import { StaffMetadataDialog } from "../components/StaffMetadataDialog/StaffMetadataDialog";
import { StaffPasswordResetDialog } from "../components/StaffPasswordResetDialog/StaffPasswordResetDialog";
import { useProfileOperations, useStaffUserOperations } from "../hooks";
import {
  staffListUrl,
  staffMemberDetailsUrl,
  type StaffMemberDetailsUrlQueryParams,
} from "../urls";
import { groupsDiff, isMemberActive } from "../utils";

interface StaffDetailsViewProps {
  id: string;
  params: StaffMemberDetailsUrlQueryParams;
}

export const StaffDetailsView: React.FC<StaffDetailsViewProps> = ({ id, params }) => {
  const navigate = useNavigator();
  const user = useUser();
  const intl = useIntl();
  const notify = useNotifier();
  const closeModal = () =>
    navigate(
      staffMemberDetailsUrl(id, {
        ...params,
        action: undefined,
      }),
    );
  const openModal = (action: NonNullable<StaffMemberDetailsUrlQueryParams["action"]>) =>
    navigate(
      staffMemberDetailsUrl(id, {
        ...params,
        action,
      }),
    );
  const isUserSameAsViewer = user.user?.id === id;
  const hasManageStaffPermission = hasPermissions(user.user.userPermissions, [
    PermissionEnum.MANAGE_STAFF,
  ]);
  const { data, loading, refetch } = useStaffMemberDetailsQuery({
    displayLoader: true,
    variables: { id },
    skip: isUserSameAsViewer && !hasManageStaffPermission,
  });
  const { deleteResult, deleteStaffMember, updateStaffMember, updateStaffMemberOpts } =
    useStaffUserOperations();
  // Separate from form save so Activate/Deactivate does not drive the Savebar
  // or paint status errors onto name/email/permission fields.
  const [updateStaffStatus, updateStaffStatusOpts] = useStaffMemberUpdateMutation({
    onCompleted: data => {
      const errors = data.staffUpdate?.errors ?? [];

      if (errors.length) {
        notify({
          status: "error",
          text:
            errors
              .map(error => error.message)
              .filter(Boolean)
              .join(", ") ||
            intl.formatMessage({
              id: "3kJE8G",
              defaultMessage: "Something went wrong. Try again.",
            }),
        });

        return;
      }

      const activated = !!data.staffUpdate?.user?.isActive;

      notify({
        status: "success",
        text: intl.formatMessage(
          activated
            ? {
                id: "mQ8v1C",
                defaultMessage: "Staff member activated",
                description: "success toast after activating a staff member",
              }
            : {
                id: "kP2n4A",
                defaultMessage: "Staff member deactivated",
                description: "success toast after deactivating a staff member",
              },
        ),
      });
      closeModal();
    },
  });
  const {
    updateUserAccount,
    updateUserAccountOpts,
    deleteAvatarResult,
    deleteUserAvatar,
    updateUserAvatar,
  } = useProfileOperations({ closeModal, id, refetch });
  // Prefer staff details (includes isActive / lastLogin). Own-profile used to always
  // take the auth User fragment, which lacked those fields → false "Not active".
  const staffMember = data !== undefined ? data.user : isUserSameAsViewer ? user.user : undefined;
  const canViewCustomerProfile = (data?.user?.orders?.edges.length ?? 0) > 0;
  const canEditMetadata = !!data?.user;
  const isActive = isMemberActive(staffMember);
  const invitePending = isStaffInvitePending(staffMember);
  const {
    loadMore: loadMorePermissionGroups,
    search: searchPermissionGroups,
    result: searchPermissionGroupsOpts,
  } = usePermissionGroupSearch({
    variables: DEFAULT_INITIAL_SEARCH_DATA,
    skip: !hasManageStaffPermission,
  });
  // Saleor has no staffResendInvite; requestPasswordReset reuses the set-password token flow.
  const [resendStaffInvite, resendStaffInviteOpts] = useRequestPasswordResetMutation({
    onCompleted: result => {
      if (result?.requestPasswordReset?.errors?.length) {
        notify({
          status: "error",
          text: result.requestPasswordReset.errors.map(error => error.message).join(", "),
          title: intl.formatMessage({
            id: "WQ7yWS",
            defaultMessage: "Couldn’t resend invitation",
            description: "toast title when resend invite fails",
          }),
        });

        return;
      }

      notify({
        status: "success",
        title: intl.formatMessage({
          id: "RjDmqa",
          defaultMessage: "Invitation resent",
          description: "toast title after resending staff invite",
        }),
        text: intl.formatMessage({
          id: "cMyuOj",
          defaultMessage: "They’ll get a password reset email with a link to set their password.",
          description: "toast body after resending staff invite",
        }),
      });
      closeModal();
    },
    onError: () => {
      notify({
        status: "error",
        text: intl.formatMessage({
          id: "WQ7yWS",
          defaultMessage: "Couldn’t resend invitation",
          description: "toast title when resend invite fails",
        }),
      });
    },
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
  const handleToggleStaffStatus = () =>
    extractMutationErrors(
      updateStaffStatus({
        variables: {
          id,
          input: {
            isActive: !isActive,
          },
        },
      }),
    );
  const handleResendInvite = () => {
    const email = staffMember?.email;

    if (!email) {
      return;
    }

    return resendStaffInvite({
      variables: {
        email,
        redirectUrl: getNewPasswordResetRedirectUrl(),
      },
    });
  };

  const formErrors = isUserSameAsViewer
    ? []
    : updateStaffMemberOpts?.data?.staffUpdate?.errors || [];

  return (
    <>
      <WindowTitle title={getStringOrPlaceholder(staffMember?.email)} />
      <StaffDetailsPage
        errors={formErrors}
        canEditAvatar={isUserSameAsViewer}
        canEditPreferences={isUserSameAsViewer}
        canEditEmail={!isUserSameAsViewer}
        canEditStatus={!isUserSameAsViewer}
        canRemove={!isUserSameAsViewer}
        canViewCustomerProfile={canViewCustomerProfile}
        disabled={loading}
        disabledStatus={updateStaffStatusOpts.loading}
        initialSearch=""
        onResetPassword={() => openModal("reset-password")}
        onDelete={() => openModal("remove")}
        onToggleStaffStatus={() => openModal(isActive ? "deactivate" : "activate")}
        onResendInvite={
          invitePending && isActive && !isUserSameAsViewer
            ? () => openModal("resend-invite")
            : undefined
        }
        onShowMetadata={canEditMetadata ? () => openModal("view-metadata") : undefined}
        onSubmit={isUserSameAsViewer ? handleUserUpdate : handleStaffUpdate}
        onImageUpload={file =>
          updateUserAvatar({
            variables: {
              image: file,
            },
          })
        }
        onImageDelete={() => openModal("remove-avatar")}
        onViewCustomerProfile={() => navigate(customerUrl(id))}
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
      <StaffMetadataDialog
        open={params.action === "view-metadata"}
        onClose={closeModal}
        staffMember={data?.user}
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
        <FormattedMessage
          id="gxPjIQ"
          defaultMessage="Are you sure you want to delete {email} from staff members?"
          values={{
            email: getStringOrPlaceholder(data?.user?.email),
          }}
        />
      </ActionDialog>
      <ActionDialog
        open={params.action === "activate"}
        title={intl.formatMessage({
          id: "5MmwNP",
          defaultMessage: "Activate staff member",
          description: "dialog header",
        })}
        confirmButtonState={updateStaffStatusOpts.status}
        onClose={closeModal}
        onConfirm={handleToggleStaffStatus}
      >
        <FormattedMessage
          id="hbNxgV"
          defaultMessage="Are you sure you want to activate {email}?"
          values={{
            email: getStringOrPlaceholder(data?.user?.email),
          }}
        />
      </ActionDialog>
      <ActionDialog
        open={params.action === "deactivate"}
        title={intl.formatMessage({
          id: "BcKoQ9",
          defaultMessage: "Deactivate staff member",
          description: "dialog header",
        })}
        confirmButtonState={updateStaffStatusOpts.status}
        confirmButtonLabel={intl.formatMessage({
          id: "MMPgsZ",
          defaultMessage: "Deactivate",
          description: "staff deactivate dialog confirm button",
        })}
        variant="delete"
        onClose={closeModal}
        onConfirm={handleToggleStaffStatus}
      >
        <FormattedMessage
          id="gIDsue"
          defaultMessage="Deactivate {email}? They won’t be able to sign in to the dashboard until you activate them again. Their account and permissions are kept."
          description="staff deactivate confirmation — explains effect for merchants"
          values={{
            email: <strong>{getStringOrPlaceholder(staffMember?.email)}</strong>,
          }}
        />
      </ActionDialog>
      <ActionDialog
        open={params.action === "resend-invite"}
        title={intl.formatMessage({
          id: "8ZFJV+",
          defaultMessage: "Resend invitation",
          description: "dialog header for resending staff invite",
        })}
        confirmButtonState={resendStaffInviteOpts.status}
        confirmButtonLabel={intl.formatMessage({
          id: "n9bERs",
          defaultMessage: "Resend invitation",
          description: "staff details top nav CTA for pending invite",
        })}
        onClose={closeModal}
        onConfirm={handleResendInvite}
      >
        <FormattedMessage
          id="v+tpSR"
          defaultMessage="We’ll email {email} a link to set their password. It arrives as a password reset message, but works the same as the original invite."
          description="dialog body explaining password-reset email for resend invite"
          values={{
            email: <strong>{getStringOrPlaceholder(staffMember?.email)}</strong>,
          }}
        />
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
        <FormattedMessage
          id="fzpXvv"
          defaultMessage="Are you sure you want to remove {email} avatar?"
          values={{
            email: <strong>{getStringOrPlaceholder(data?.user?.email)}</strong>,
          }}
        />
      </ActionDialog>
      <StaffPasswordResetDialog open={params.action === "reset-password"} onClose={closeModal} />
    </>
  );
};
