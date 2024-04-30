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

export const useProfileOperations = ({ refetch, id, closeModal }: UseUserMutationProps) => {
  const notify = useNotifier();
  const intl = useIntl();
  const navigate = useNavigator();
  const [updateUserAccount, updateUserAccountOpts] = useUserAccountUpdateMutation({
    onCompleted: data => {
      if (!data.accountUpdate?.errors.length) {
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
      if (!data.userAvatarUpdate?.errors.length) {
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
      if (!data.userAvatarDelete?.errors.length) {
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
      if (!data.passwordChange?.errors.length) {
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
