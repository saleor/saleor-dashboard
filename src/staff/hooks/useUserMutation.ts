import { maybe } from "@apollo/client/utilities";
import { useUserAccountUpdateMutation } from "@dashboard/graphql";
import useNotifier from "@dashboard/hooks/useNotifier";
import { commonMessages } from "@dashboard/intl";
import { useIntl } from "react-intl";

export const useUserMutation = () => {
  const notify = useNotifier();
  const intl = useIntl();

  const [updateUserAccount] = useUserAccountUpdateMutation({
    onCompleted: data => {
      if (!maybe(() => data.accountUpdate.errors.length !== 0)) {
        notify({
          status: "success",
          text: intl.formatMessage(commonMessages.savedChanges),
        });
      }
    },
  });

  return { updateUserAccount };
};
