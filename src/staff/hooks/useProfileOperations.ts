import {
  useChangeUserPasswordMutation,
  useUserAccountUpdateMutation,
  useUserAvatarDeleteMutation,
  useUserAvatarUpdateMutation,
} from "@dashboard/graphql";
import useNavigator from "@dashboard/hooks/useNavigator";
import { useNotifier } from "@dashboard/hooks/useNotifier/useNotifier";
import { commonMessages, errorMessages } from "@dashboard/intl";
import getAccountErrorMessage from "@dashboard/utils/errors/account";
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
      const errors = data.accountUpdate?.errors ?? [];

      if (!errors.length) {
        refetch();
        notify({
          status: "success",
          text: intl.formatMessage({ id: "B5/YE0", defaultMessage: "Profile updated" }),
        });

        return;
      }

      notify({
        status: "error",
        text:
          errors
            .map(error => getAccountErrorMessage(error, intl) ?? error.message)
            .filter((message): message is string => Boolean(message))
            .join(", ") || intl.formatMessage(commonMessages.somethingWentWrong),
      });
    },
  });
  const [updateUserAvatar] = useUserAvatarUpdateMutation({
    onCompleted: data => {
      if (!data.userAvatarUpdate?.errors.length) {
        notify({
          status: "success",
          text: intl.formatMessage({ id: "6V+aAL", defaultMessage: "Avatar updated" }),
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
          text: intl.formatMessage({ id: "Z/jtCO", defaultMessage: "Avatar deleted" }),
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
          text: intl.formatMessage({ id: "h9aBq7", defaultMessage: "Password changed" }),
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
