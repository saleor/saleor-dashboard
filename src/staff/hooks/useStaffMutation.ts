import {
  useChangeStaffPasswordMutation,
  useStaffAvatarDeleteMutation,
  useStaffAvatarUpdateMutation,
  useStaffMemberDeleteMutation,
  useStaffMemberUpdateMutation,
} from "@dashboard/graphql";
import useNavigator from "@dashboard/hooks/useNavigator";
import useNotifier from "@dashboard/hooks/useNotifier";
import { commonMessages, errorMessages } from "@dashboard/intl";
import { maybe } from "@dashboard/misc";
import { useIntl } from "react-intl";

import { staffListUrl, staffMemberDetailsUrl } from "../urls";

export const useStaffMutation = ({ closeModal, refetch, id }) => {
  const notify = useNotifier();
  const intl = useIntl();
  const navigate = useNavigator();

  const [changePassword, changePasswordOpts] = useChangeStaffPasswordMutation({
    onCompleted: data => {
      if (data.passwordChange.errors.length === 0) {
        notify({
          status: "success",
          text: intl.formatMessage(commonMessages.savedChanges),
        });
        closeModal();
      }
    },
  });

  const [updateStaffMember, updateStaffMemberOpts] =
    useStaffMemberUpdateMutation({
      onCompleted: data => {
        if (!maybe(() => data.staffUpdate.errors.length !== 0)) {
          notify({
            status: "success",
            text: intl.formatMessage(commonMessages.savedChanges),
          });
        }
      },
    });

  const [deleteStaffMember, deleteResult] = useStaffMemberDeleteMutation({
    onCompleted: data => {
      if (!maybe(() => data.staffDelete.errors.length !== 0)) {
        notify({
          status: "success",
          text: intl.formatMessage(commonMessages.savedChanges),
        });
        navigate(staffListUrl());
      }
    },
  });

  const [updateStaffAvatar] = useStaffAvatarUpdateMutation({
    onCompleted: data => {
      if (!maybe(() => data.userAvatarUpdate.errors.length !== 0)) {
        notify({
          status: "success",
          text: intl.formatMessage(commonMessages.savedChanges),
        });
        refetch();
      } else {
        notify({
          status: "error",
          title: intl.formatMessage(errorMessages.imgageUploadErrorTitle),
          text: intl.formatMessage(errorMessages.imageUploadErrorText),
        });
      }
    },
  });

  const [deleteStaffAvatar, deleteAvatarResult] = useStaffAvatarDeleteMutation({
    onCompleted: data => {
      if (!maybe(() => data.userAvatarDelete.errors.length !== 0)) {
        notify({
          status: "success",
          text: intl.formatMessage(commonMessages.savedChanges),
        });
        navigate(staffMemberDetailsUrl(id));
        refetch();
      }
    },
  });

  return {
    changePassword,
    changePasswordOpts,
    updateStaffMember,
    updateStaffMemberOpts,
    deleteStaffMember,
    deleteResult,
    updateStaffAvatar,
    deleteStaffAvatar,
    deleteAvatarResult,
  };
};
