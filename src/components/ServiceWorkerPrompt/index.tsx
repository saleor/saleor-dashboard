import React from "react";
import { useRegisterSW } from "virtual:pwa-register/react";

import { Animated } from "./Animated";
import { Container } from "./Container";
import { NewVersionAvailable } from "./NewVersionAvailable";
import { useNavigatorOnline } from "./useNavigatorOnline";
import { YouAreOffline } from "./YouAreOffline";

const SW_PING_INTERVAL = 5000;

const ping = async (swScriptUrl: string, registration: ServiceWorkerRegistration) => {
  const resp = await fetch(swScriptUrl, {
    cache: "no-store",
    headers: {
      cache: "no-store",
      "cache-control": "no-cache",
    },
  });

  if (resp?.status === 200) {
    await registration.update();
  }
};

const createPingHandler =
  (swScriptUrl: string, registration: ServiceWorkerRegistration) => async () => {
    if (registration.installing || !navigator) return;

    if ("connection" in navigator && !navigator.onLine) return;

    await ping(swScriptUrl, registration);
  };

export const ServiceWorkerPrompt = () => {
  const onRegisteredSW = async (
    swScriptUrl: string,
    registration: ServiceWorkerRegistration | undefined,
  ) => {
    if (!registration) return;

    setInterval(createPingHandler(swScriptUrl, registration), SW_PING_INTERVAL);
  };

  const onUpdate = async () => {
    await updateServiceWorker();
    window.location.reload();
  };

  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW({ onRegisteredSW });

  const isOnline = useNavigatorOnline(navigator);

  return (
    <Container>
      <Animated show={!isOnline}>
        <YouAreOffline />
      </Animated>
      <Animated show={needRefresh && isOnline}>
        <NewVersionAvailable onUpdate={onUpdate} />
      </Animated>
    </Container>
  );
};
