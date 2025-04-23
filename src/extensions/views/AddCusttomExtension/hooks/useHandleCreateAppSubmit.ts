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
      if (data.appCreate.errors.length === 0) {
        notify({
          status: "success",
          text: intl.formatMessage(commonMessages.savedChanges),
        });
        navigate(ExtensionsUrls.editCustomExtensionUrl(data.appCreate.app.id));
        setToken(data.appCreate.authToken);
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
