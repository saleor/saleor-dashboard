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
import NotFoundPage from "@saleor/components/NotFoundPage";
import { maybe } from "../../misc";
import StaffDetailsPage from "../components/StaffDetailsPage/StaffDetailsPage";
import {
  TypedStaffAvatarDeleteMutation,
  TypedStaffAvatarUpdateMutation,
  TypedStaffMemberDeleteMutation,
  TypedStaffMemberUpdateMutation,
  useChangeStaffPassword
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
import StaffPasswordResetDialog from "../components/StaffPasswordResetDialog";
import { ChangeStaffPassword } from "../types/ChangeStaffPassword";

interface OrderListProps {
  id: string;
  params: StaffMemberDetailsUrlQueryParams;
}

export const StaffDetails: React.FC<OrderListProps> = ({ id, params }) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const user = useUser();
  const intl = useIntl();
  const shop = useShop();

  const closeModal = () =>
    navigate(
      staffMemberDetailsUrl(id, {
        ...params,
        action: undefined
      })
    );

  const handleChangePassword = (data: ChangeStaffPassword) => {
    if (data.passwordChange.errors.length === 0) {
      notify({
        text: intl.formatMessage(commonMessages.savedChanges)
      });
      closeModal();
    }
  };
  const [changePassword, changePasswordOpts] = useChangeStaffPassword({
    onCompleted: handleChangePassword
  });

  const handleBack = () => navigate(staffListUrl());

  return (
    <TypedStaffMemberDetailsQuery displayLoader variables={{ id }}>
      {({ data, loading }) => {
        const staffMember = data?.user;

        if (staffMember === null) {
          return <NotFoundPage onBack={handleBack} />;
        }

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
                          const isUserSameAsViewer = maybe(
                            () => user.user.id === data.user.id,
                            true
                          );

                          return (
                            <>
                              <WindowTitle
                                title={staffMember?.email || "..."}
                              />
                              <StaffDetailsPage
                                canEditAvatar={isUserSameAsViewer}
                                canEditPreferences={isUserSameAsViewer}
                                canEditStatus={!isUserSameAsViewer}
                                canRemove={!isUserSameAsViewer}
                                disabled={loading}
                                onBack={handleBack}
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
                                staffMember={staffMember}
                                saveButtonBarState={updateResult.status}
                              />
                              <ActionDialog
                                open={params.action === "remove"}
                                title={intl.formatMessage({
                                  defaultMessage: "delete Staff User",
                                  description: "dialog header"
                                })}
                                confirmButtonState={deleteResult.status}
                                variant="delete"
                                onClose={closeModal}
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
                                confirmButtonState={deleteAvatarResult.status}
                                variant="delete"
                                onClose={closeModal}
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
                              <StaffPasswordResetDialog
                                confirmButtonState={changePasswordOpts.status}
                                errors={maybe(
                                  () =>
                                    changePasswordOpts.data.passwordChange
                                      .errors,
                                  []
                                )}
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
