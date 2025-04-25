import { ExtensionsUrls } from "@dashboard/extensions/urls";
import { PermissionEnum, useAppCreateMutation } from "@dashboard/graphql";
import useNavigator from "@dashboard/hooks/useNavigator";
import useNotifier from "@dashboard/hooks/useNotifier";
import { commonMessages } from "@dashboard/intl";
import { SubmitHandler } from "react-hook-form";
import { useIntl } from "react-intl";

import { CustomExtensionFormData } from "../AddCustomExtension";

export const useHandleCreateAppSubmit = ({ setToken }: { setToken: (token: string) => void }) => {
  const intl = useIntl();
  const notify = useNotifier();

  const navigate = useNavigator();

  const [createApp] = useAppCreateMutation({
    onCompleted: data => {
      if (data?.appCreate?.errors.length === 0) {
        notify({
          status: "success",
          text: intl.formatMessage(commonMessages.savedChanges),
        });

        if (data.appCreate.authToken) {
          setToken(data.appCreate.authToken);
        } else {
          notify({
            status: "error",
            text: intl.formatMessage(commonMessages.somethingWentWrong),
          });
        }

        if (data.appCreate?.app?.id) {
          navigate(ExtensionsUrls.editCustomExtensionUrl(data.appCreate.app.id));
        }
      }
    },
  });

  const submitCreateApp: SubmitHandler<CustomExtensionFormData> = async data => {
    await createApp({
      variables: {
        input: {
          name: data.appName,
          permissions: Object.entries(data.permissions)
            .filter(([_, value]) => value)
            .map(([key]) => key as PermissionEnum),
        },
      },
    });
  };

  return submitCreateApp;
};
