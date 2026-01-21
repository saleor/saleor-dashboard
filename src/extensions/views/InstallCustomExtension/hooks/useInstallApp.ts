import { getAppInstallErrorMessage } from "@dashboard/extensions/utils";
import { useAppInstallMutation } from "@dashboard/graphql";
import useLocalStorage from "@dashboard/hooks/useLocalStorage";
import useNavigator from "@dashboard/hooks/useNavigator";
import { useNotifier } from "@dashboard/hooks/useNotifier";
import { extractMutationErrors } from "@dashboard/misc";
import { UseFormGetValues } from "react-hook-form";
import { useIntl } from "react-intl";

import { previousPagePath } from "../consts";
import { ExtensionInstallFormData, Manifest } from "../types";

export const useInstallApp = ({
  getValues,
  manifest,
}: {
  getValues: UseFormGetValues<ExtensionInstallFormData>;
  manifest: Manifest;
}) => {
  const intl = useIntl();
  const notify = useNotifier();
  const navigate = useNavigator();

  const [, setActiveInstallations] = useLocalStorage<Array<Record<"id" | "name", string>>>(
    "activeInstallations",
    [],
  );

  const [installApp, installAppOpts] = useAppInstallMutation({
    onCompleted: data => {
      const installationData = data?.appInstall?.appInstallation;

      if (data.appInstall?.errors.length === 0) {
        if (installationData) {
          setActiveInstallations(activeInstallations => [
            ...activeInstallations,
            {
              id: installationData.id,
              name: installationData.appName,
            },
          ]);
        }

        navigate(previousPagePath);
      } else {
        (data?.appInstall?.errors ?? []).forEach(error => {
          notify({
            status: "error",
            text: getAppInstallErrorMessage(error, intl),
          });
        });
      }
    },
  });

  const submitInstallApp = async () => {
    const errors = await extractMutationErrors(
      installApp({
        variables: {
          input: {
            appName: manifest?.name,
            manifestUrl: getValues("manifestUrl"),
            permissions: manifest?.permissions?.map(permission => permission.code),
          },
        },
      }),
    );

    if (!errors) {
      navigate(previousPagePath);
    }
  };

  return {
    submitInstallApp,
    isSubmittingInstallation: installAppOpts.loading,
  };
};
