import { notifyMessages } from "@dashboard/extensions/messages";
import { useNotifier } from "@dashboard/hooks/useNotifier";
import { useIntl } from "react-intl";

export const useInstallationNotify = () => {
  const intl = useIntl();
  const notify = useNotifier();

  const installedNotify = (name: string) => {
    notify({
      status: "success",
      text: intl.formatMessage(notifyMessages.extensionReadyToUse, { name }),
      title: intl.formatMessage(notifyMessages.extensionInstalled),
    });
  };
  const removeInProgressAppNotify = () => {
    notify({
      status: "success",
      text: intl.formatMessage(notifyMessages.extensionRemoved),
    });
  };
  const errorNotify = (message: string, extensionName: string) => {
    notify({
      status: "error",
      text: message,
      title: intl.formatMessage(notifyMessages.extensionInstallError, {
        name: extensionName,
      }),
    });
  };

  return {
    installedNotify,
    removeInProgressAppNotify,
    errorNotify,
  };
};
