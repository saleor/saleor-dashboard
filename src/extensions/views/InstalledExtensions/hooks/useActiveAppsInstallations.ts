import { useApolloClient } from "@apollo/client";
import {
  AppInstallationFragment,
  AppsInstallationsQuery,
  JobStatusEnum,
  useAppDeleteFailedInstallationMutation,
  useAppRetryInstallMutation,
} from "@dashboard/graphql";
import useLocalStorage from "@dashboard/hooks/useLocalStorage";
import { useEffect, useRef } from "react";

interface UseActiveAppsInstallations {
  appsInProgressData: AppsInstallationsQuery | undefined;
  appInProgressLoading: boolean;
  appsInProgressRefetch: () => void;
  appsRefetch: () => void;
  removeInProgressAppNotify: () => void;
  installedAppNotify: (name: string) => void;
  onInstallSuccess: () => void;
  onInstallError: (installation: AppInstallationFragment) => void;
  onRemoveInProgressAppSuccess: () => void;
}

const EXTENSION_LIST_QUERY = "ExtensionList";

export const useActiveAppsInstallations = ({
  appsInProgressData,
  appsInProgressRefetch,
  appInProgressLoading,
  appsRefetch,
  installedAppNotify,
  removeInProgressAppNotify,
  onInstallSuccess,
  onInstallError,
  onRemoveInProgressAppSuccess,
}: UseActiveAppsInstallations) => {
  const client = useApolloClient();
  const [activeInstallations, setActiveInstallations] = useLocalStorage<
    Array<Record<"id" | "name", string>>
  >("activeInstallations", []);
  const intervalId = useRef<null | number>(null);
  const refetchExtensionList = () => {
    client.refetchQueries({
      include: [EXTENSION_LIST_QUERY],
    });
  };
  const removeInstallation = (id: string) =>
    setActiveInstallations(installations => installations.filter(item => item.id !== id));
  const [retryInstallApp, retryInstallAppOpts] = useAppRetryInstallMutation({
    onCompleted: data => {
      if (!data?.appRetryInstall?.errors?.length) {
        const appInstallation = data.appRetryInstall?.appInstallation;

        if (appInstallation) {
          setActiveInstallations(installations => [
            ...installations,
            {
              id: appInstallation.id,
              name: appInstallation.appName,
            },
          ]);
        }
      }
    },
  });
  const handleAppInstallRetry = (id: string) => retryInstallApp({ variables: { id } });
  const [deleteInProgressApp, deleteInProgressAppOpts] = useAppDeleteFailedInstallationMutation({
    onCompleted: data => {
      if (!data?.appDeleteFailedInstallation?.errors?.length) {
        removeInProgressAppNotify();
        appsInProgressRefetch();
        onRemoveInProgressAppSuccess();
      }
    },
  });
  const handleRemoveInProgress = (id: string) =>
    deleteInProgressApp({
      variables: {
        id,
      },
    });

  /**
   * Check if there has occurred by any reason untracked installation with status PENDING and add it to activeInstallations.
   */
  useEffect(
    () =>
      appsInProgressData?.appsInstallations?.forEach(app => {
        if (app.status === JobStatusEnum.PENDING) {
          const item = activeInstallations.find(installation => installation.id === app.id);

          if (!item) {
            setActiveInstallations(installations => [
              ...installations,
              {
                id: app.id,
                name: app.appName,
              },
            ]);
          }
        }
      }),
    [appsInProgressData],
  );
  /**
   * Fetch active installations to make its status in localStorage up to date.
   */
  useEffect(() => {
    if (activeInstallations.length && !!appsInProgressData) {
      if (!intervalId.current) {
        intervalId.current = window.setInterval(() => {
          appsInProgressRefetch();
          appsRefetch();
        }, 2000);
      }
    }

    if (!activeInstallations.length && intervalId.current) {
      clearInterval(intervalId.current);
      intervalId.current = null;
    }

    return () => {
      if (intervalId.current) {
        clearInterval(intervalId.current);
        intervalId.current = null;
      }
    };
  }, [activeInstallations.length, appsInProgressData]);
  /**
   * Do what is needed and call chaange handlers when installation status changes.
   */
  useEffect(() => {
    const appsInProgress = appsInProgressData?.appsInstallations || [];

    if (activeInstallations.length && !appInProgressLoading) {
      let newAppInstalled = false;

      activeInstallations.forEach(installation => {
        const item = appsInProgress?.find(app => app.id === installation.id);

        if (!item) {
          removeInstallation(installation.id);
          installedAppNotify(installation.name);
          appsInProgressRefetch();
          appsRefetch();
          newAppInstalled = true;
        } else if (item.status === JobStatusEnum.SUCCESS) {
          removeInstallation(installation.id);
          installedAppNotify(item.appName);
          onInstallSuccess();
          newAppInstalled = true;
        } else if (item.status === JobStatusEnum.FAILED) {
          removeInstallation(installation.id);
          onInstallError(item);
        }
      });

      if (newAppInstalled) {
        refetchExtensionList();
      }
    }
  }, [activeInstallations.length, appsInProgressData]);

  return {
    handleAppInstallRetry,
    handleRemoveInProgress,
    retryInstallAppOpts: {
      status: retryInstallAppOpts.status,
      loading: retryInstallAppOpts.loading,
    },
    deleteInProgressAppOpts: {
      status: deleteInProgressAppOpts.status,
      loading: deleteInProgressAppOpts.loading,
    },
  };
};
