import { maybe } from "@apollo/client/utilities";
import {
  useChangeUserPasswordMutation,
  useUserAccountUpdateMutation,
  useUserAvatarDeleteMutation,
  useUserAvatarUpdateMutation,
} from "@dashboard/graphql";
import useNavigator from "@dashboard/hooks/useNavigator";
import useNotifier from "@dashboard/hooks/useNotifier";
import { commonMessages, errorMessages } from "@dashboard/intl";
import { useIntl } from "react-intl";

import { staffMemberDetailsUrl } from "../urls";

interface UseUserMutationProps {
  refetch: () => void;
  id: string;
  closeModal: () => void;
}

export const useUserMutation = ({
  refetch,
  id,
  closeModal,
}: UseUserMutationProps) => {
  const notify = useNotifier();
  const intl = useIntl();
  const navigate = useNavigator();

  const [updateUserAccount, updateUserAccountOpts] =
    useUserAccountUpdateMutation({
      onCompleted: data => {
        if (!maybe(() => data.accountUpdate.errors.length !== 0)) {
          refetch();
          notify({
            status: "success",
            text: intl.formatMessage(commonMessages.savedChanges),
          });
        }
      },
    });

  const [updateUserAvatar] = useUserAvatarUpdateMutation({
    onCompleted: data => {
      if (!maybe(() => data.userAvatarUpdate.errors.length !== 0)) {
        notify({
          status: "success",
          text: intl.formatMessage(commonMessages.savedChanges),
        });
        refetch();
        navigate(staffMemberDetailsUrl(id));
      } else {
        notify({
          status: "error",
          title: intl.formatMessage(errorMessages.imgageUploadErrorTitle),
          text: intl.formatMessage(errorMessages.imageUploadErrorText),
        });
      }
    },
  });

  const [deleteUserAvatar, deleteAvatarResult] = useUserAvatarDeleteMutation({
    onCompleted: data => {
      if (!maybe(() => data.userAvatarDelete.errors.length !== 0)) {
        notify({
          status: "success",
          text: intl.formatMessage(commonMessages.savedChanges),
        });
        refetch();
        navigate(staffMemberDetailsUrl(id));
      }
    },
  });

  const [changePassword, changePasswordOpts] = useChangeUserPasswordMutation({
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

  return {
    updateUserAccount,
    deleteAvatarResult,
    deleteUserAvatar,
    updateUserAvatar,
    changePassword,
    changePasswordOpts,
    updateUserAccountOpts,
  };
};
