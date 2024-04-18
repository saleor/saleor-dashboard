import { useCallback, useEffect, useRef, useState } from "react";
import { register } from "register-service-worker";

const SW_PATH = `${process.env.STATIC_URL || "/"}sw.js`;

export const useServiceWorker = (timeout: number) => {
  const [updateAvailable, setUpdateAvailable] = useState<boolean>(false);
  const registrationRef = useRef<ServiceWorkerRegistration>();

  useEffect(() => {
    const interval = setInterval(() => {
      if (registrationRef.current) {
        registrationRef.current.update();
      }
    }, timeout) as unknown as number;
    return () => clearInterval(interval);
  }, [timeout]);

  const onRegistered = (registration: ServiceWorkerRegistration) => {
    registrationRef.current = registration;
  };
  const onUpdate = (registration: ServiceWorkerRegistration) => {
    setUpdateAvailable(!!registration?.waiting);
  };
  const update = useCallback(() => {
    if (updateAvailable && registrationRef.current?.waiting) {
      registrationRef.current.waiting.postMessage("update");
    }
  }, [updateAvailable]);

  useEffect(() => {
    register(SW_PATH, {
      registered: onRegistered,
      updated: onUpdate,
    });
  }, []);

  return { update, updateAvailable };
};
