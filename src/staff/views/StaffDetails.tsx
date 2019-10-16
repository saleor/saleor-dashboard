import DialogContentText from "@material-ui/core/DialogContentText";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import ActionDialog from "@saleor/components/ActionDialog";
import { WindowTitle } from "@saleor/components/WindowTitle";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import useShop from "@saleor/hooks/useShop";
import useUser from "@saleor/hooks/useUser";
import { commonMessages } from "@saleor/intl";
import { getMutationState, maybe } from "../../misc";
import StaffDetailsPage from "../components/StaffDetailsPage/StaffDetailsPage";
import {
  TypedStaffAvatarDeleteMutation,
  TypedStaffAvatarUpdateMutation,
  TypedStaffMemberDeleteMutation,
  TypedStaffMemberUpdateMutation
} from "../mutations";
import { TypedStaffMemberDetailsQuery } from "../queries";
import { StaffAvatarDelete } from "../types/StaffAvatarDelete";
import { StaffAvatarUpdate } from "../types/StaffAvatarUpdate";
import { StaffMemberDelete } from "../types/StaffMemberDelete";
import { StaffMemberUpdate } from "../types/StaffMemberUpdate";
import {
  staffListUrl,
  staffMemberDetailsUrl,
  StaffMemberDetailsUrlQueryParams
} from "../urls";

interface OrderListProps {
  id: string;
  params: StaffMemberDetailsUrlQueryParams;
}

export const StaffDetails: React.StatelessComponent<OrderListProps> = ({
  id,
  params
}) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const user = useUser();
  const intl = useIntl();
  const shop = useShop();

  return (
    <TypedStaffMemberDetailsQuery
      displayLoader
      variables={{ id }}
      require={["user"]}
    >
      {({ data, loading }) => {
        const handleStaffMemberUpdate = (data: StaffMemberUpdate) => {
          if (!maybe(() => data.staffUpdate.errors.length !== 0)) {
            notify({
              text: intl.formatMessage(commonMessages.savedChanges)
            });
          }
        };
        const handleStaffMemberDelete = (data: StaffMemberDelete) => {
          if (!maybe(() => data.staffDelete.errors.length !== 0)) {
            notify({
              text: intl.formatMessage(commonMessages.savedChanges)
            });
            navigate(staffListUrl());
          }
        };
        const handleStaffMemberAvatarUpdate = (data: StaffAvatarUpdate) => {
          if (!maybe(() => data.userAvatarUpdate.errors.length !== 0)) {
            notify({
              text: intl.formatMessage(commonMessages.savedChanges)
            });
          }
        };
        const handleStaffMemberAvatarDelete = (data: StaffAvatarDelete) => {
          if (!maybe(() => data.userAvatarDelete.errors.length !== 0)) {
            notify({
              text: intl.formatMessage(commonMessages.savedChanges)
            });
            navigate(staffMemberDetailsUrl(id));
          }
        };
        return (
          <TypedStaffMemberUpdateMutation onCompleted={handleStaffMemberUpdate}>
            {(updateStaffMember, updateResult) => (
              <TypedStaffMemberDeleteMutation
                variables={{ id }}
                onCompleted={handleStaffMemberDelete}
              >
                {(deleteStaffMember, deleteResult) => (
                  <TypedStaffAvatarUpdateMutation
                    onCompleted={handleStaffMemberAvatarUpdate}
                  >
                    {updateStaffAvatar => (
                      <TypedStaffAvatarDeleteMutation
                        onCompleted={handleStaffMemberAvatarDelete}
                      >
                        {(deleteStaffAvatar, deleteAvatarResult) => {
                          const formTransitionState = getMutationState(
                            updateResult.called,
                            updateResult.loading,
                            maybe(() => updateResult.data.staffUpdate.errors)
                          );
                          const deleteTransitionState = getMutationState(
                            deleteResult.called,
                            deleteResult.loading,
                            maybe(() => deleteResult.data.staffDelete.errors)
                          );
                          const deleteAvatarTransitionState = getMutationState(
                            deleteAvatarResult.called,
                            deleteAvatarResult.loading,
                            maybe(
                              () =>
                                deleteAvatarResult.data.userAvatarDelete.errors
                            )
                          );
                          const isUserSameAsViewer = maybe(
                            () => user.user.id === data.user.id,
                            true
                          );

                          return (
                            <>
                              <WindowTitle
                                title={maybe(() => data.user.email)}
                              />
                              <StaffDetailsPage
                                canEditAvatar={isUserSameAsViewer}
                                canEditPreferences={isUserSameAsViewer}
                                canEditStatus={!isUserSameAsViewer}
                                canRemove={!isUserSameAsViewer}
                                disabled={loading}
                                onBack={() => navigate(staffListUrl())}
                                onDelete={() =>
                                  navigate(
                                    staffMemberDetailsUrl(id, {
                                      action: "remove"
                                    })
                                  )
                                }
                                onSubmit={variables =>
                                  updateStaffMember({
                                    variables: {
                                      id,
                                      input: {
                                        email: variables.email,
                                        firstName: variables.firstName,
                                        isActive: variables.isActive,
                                        lastName: variables.lastName,
                                        permissions: variables.permissions
                                      }
                                    }
                                  })
                                }
                                onImageUpload={file =>
                                  updateStaffAvatar({
                                    variables: {
                                      image: file
                                    }
                                  })
                                }
                                onImageDelete={() =>
                                  navigate(
                                    staffMemberDetailsUrl(id, {
                                      action: "remove-avatar"
                                    })
                                  )
                                }
                                permissions={maybe(() => shop.permissions)}
                                staffMember={maybe(() => data.user)}
                                saveButtonBarState={formTransitionState}
                              />
                              <ActionDialog
                                open={params.action === "remove"}
                                title={intl.formatMessage({
                                  defaultMessage: "delete Staff User",
                                  description: "dialog header"
                                })}
                                confirmButtonState={deleteTransitionState}
                                variant="delete"
                                onClose={() =>
                                  navigate(staffMemberDetailsUrl(id))
                                }
                                onConfirm={deleteStaffMember}
                              >
                                <DialogContentText>
                                  <FormattedMessage
                                    defaultMessage="Are you sure you want to delete {email} from staff members?"
                                    values={{
                                      email: maybe(() => data.user.email, "...")
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
                                confirmButtonState={deleteAvatarTransitionState}
                                variant="delete"
                                onClose={() =>
                                  navigate(staffMemberDetailsUrl(id))
                                }
                                onConfirm={deleteStaffAvatar}
                              >
                                <DialogContentText>
                                  <FormattedMessage
                                    defaultMessage="Are you sure you want to remove {email} avatar?"
                                    values={{
                                      email: (
                                        <strong>
                                          {maybe(() => data.user.email, "...")}
                                        </strong>
                                      )
                                    }}
                                  />
                                </DialogContentText>
                              </ActionDialog>
                            </>
                          );
                        }}
                      </TypedStaffAvatarDeleteMutation>
                    )}
                  </TypedStaffAvatarUpdateMutation>
                )}
              </TypedStaffMemberDeleteMutation>
            )}
          </TypedStaffMemberUpdateMutation>
        );
      }}
    </TypedStaffMemberDetailsQuery>
  );
};

export default StaffDetails;
