import React from "react";
import { useRegisterSW } from "virtual:pwa-register/react";

import { NewVersionAvailable } from "./NewVersionAvailable";
import { YouAreOffline } from "./YouAreOffline";

export const TopWarning = () => {
  const {
    needRefresh: [needRefresh],
    offlineReady: [offlineReady],
  } = useRegisterSW();

  if (offlineReady) {
    return <YouAreOffline />;
  }

  if (needRefresh) {
    return <NewVersionAvailable />;
  }

  return null;
};
