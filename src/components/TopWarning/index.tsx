import React from "react";
import { YouAreOffline } from "./YouAreOffline";
import { useRegisterSW } from "virtual:pwa-register/react";
import { NewVersionAvailable } from "./NewVersionAvailable";

export const TopWarning = () => {
  const {
    needRefresh: [needRefresh],
    offlineReady: [offlineReady],
  } = useRegisterSW();

  
  if (offlineReady) {
    return <YouAreOffline />
  }

  if (needRefresh) {
    return <NewVersionAvailable />
  }

  return null
};


