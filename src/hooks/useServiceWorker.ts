import { useEffect, useState } from "react";
import { register, unregister } from "register-service-worker";

export const useServiceWorker = (timeout: number) => {
  const [updateAvailable, setUpdateAvailable] = useState<boolean>(false);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration>();

  useEffect(() => {
    const interval = (setInterval(() => {
      if (registration) {
        registration.update();
      }
    }, timeout) as unknown) as number;
    return () => clearInterval(interval);
  }, [registration, timeout]);

  const onRegistered = (registration: ServiceWorkerRegistration) =>
    setRegistration(registration);

  const onUpdate = () => setUpdateAvailable(false);

  const onUpdateFound = () => setUpdateAvailable(true);

  useEffect(() => {
    register("/sw.js", {
      registered: onRegistered,
      updated: onUpdate,
      updatefound: onUpdateFound
    });
    return () => unregister();
  }, []);

  return { updateAvailable };
};
