import { ExtensionsUrls } from "@dashboard/extensions/urls";
import { AppErrorCode, PermissionEnum, useAppCreateMutation } from "@dashboard/graphql";
import useNavigator from "@dashboard/hooks/useNavigator";
import { useNotifier } from "@dashboard/hooks/useNotifier";
import { commonMessages } from "@dashboard/intl";
import { SubmitHandler, UseFormSetError } from "react-hook-form";
import { useIntl } from "react-intl";

import { CustomExtensionFormData } from "../AddCustomExtension";

export const useHandleCreateAppSubmit = ({
  setToken,
  setError,
}: {
  setToken: (token: string) => void;
  setError: UseFormSetError<CustomExtensionFormData>;
}) => {
  const intl = useIntl();
  const notify = useNotifier();

  const navigate = useNavigator();

  const [createApp] = useAppCreateMutation({
    onCompleted: data => {
      if (data?.appCreate?.errors?.length === 0) {
        notify({
          status: "success",
          text: intl.formatMessage({ id: "GyXEWS", defaultMessage: "App created" }),
        });

        if (data.appCreate?.authToken) {
          setToken(data.appCreate.authToken);
        } else {
          notify({
            status: "error",
            text: intl.formatMessage(commonMessages.somethingWentWrong),
          });
        }

        if (data.appCreate?.app?.id) {
          navigate(ExtensionsUrls.editCustomExtensionUrl(data.appCreate.app.id));
        } else {
          navigate(ExtensionsUrls.resolveInstalledExtensionsUrl());
        }
      } else if (data?.appCreate?.errors) {
        data.appCreate.errors.forEach(error => {
          switch (error.code) {
            case AppErrorCode.INVALID:
            case AppErrorCode.REQUIRED:
            case AppErrorCode.UNIQUE:
              if (error.field === "name") {
                setError("appName", {
                  message: error.message || intl.formatMessage(commonMessages.requiredField),
                });
              }

              break;

            case AppErrorCode.OUT_OF_SCOPE_PERMISSION:
              if (error.permissions) {
                error.permissions.forEach(permission => {
                  setError(`permissions.${permission}`, {
                    message: intl.formatMessage({
                      id: "e9z98s",
                      defaultMessage: "You don't have access to this permission",
                    }),
                  });
                });
              }

              break;

            case AppErrorCode.FORBIDDEN:
              notify({
                status: "error",
                text: error.message || intl.formatMessage(commonMessages.insufficientPermissions),
              });
              break;

            default:
              // For any other errors, show a notification
              notify({
                status: "error",
                text: error.message || intl.formatMessage(commonMessages.somethingWentWrong),
              });
          }
        });
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
