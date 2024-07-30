import { DashboardModal } from "@dashboard/components/Modal";
import useNotifier from "@dashboard/hooks/useNotifier";
import { Button, Text } from "@saleor/macaw-ui-next";
import React, { useEffect } from "react";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { useRegisterSW } from "virtual:pwa-register/react";

const AppUpdateModal = () => {
  const notify = useNotifier();
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(swUrl, r) {
      // eslint-disable-next-line no-console
      console.log("SW Registered: " + r + " at " + swUrl);
    },
    onRegisterError(error) {
      // eslint-disable-next-line no-console
      console.log("SW registration error", error);
    },
  });

  const close = () => {
    setOfflineReady(false);
    setNeedRefresh(false);
  };

  useEffect(() => {
    offlineReady &&
      notify({
        title: "Ready",
        text: "App is ready to work offline",
      });
  }, [notify, offlineReady]);

  return (
    <DashboardModal onChange={close} open={needRefresh}>
      <DashboardModal.Content>
        <DashboardModal.Title>Install update</DashboardModal.Title>
        <Text>A new app update is available.</Text>
        <Text>
          <strong>Reload</strong> will refresh the app. You may lose the progress, if any.
        </Text>
        <Text>
          <strong>Cancel</strong> will install the update next time you visit the app.
        </Text>

        <DashboardModal.Actions>
          <Button variant="secondary" onClick={close}>
            Cancel
          </Button>
          <Button onClick={() => updateServiceWorker(true)}>Reload</Button>
        </DashboardModal.Actions>
      </DashboardModal.Content>
    </DashboardModal>
  );
};

export default AppUpdateModal;
