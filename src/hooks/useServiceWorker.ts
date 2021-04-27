import { useCallback, useEffect, useRef, useState } from "react";
import { register } from "register-service-worker";

export const useServiceWorker = (timeout: number) => {
  const [updateAvailable, setUpdateAvailable] = useState<boolean>(false);
  const registrationRef = useRef<ServiceWorkerRegistration>();

  useEffect(() => {
    const interval = (setInterval(() => {
      if (registrationRef.current) {
        registrationRef.current.update();
      }
    }, timeout) as unknown) as number;
    return () => clearInterval(interval);
  }, [timeout]);

  const onRegistered = (registration: ServiceWorkerRegistration) => {
    registrationRef.current = registration;
  };

  const onUpdateFound = () => setUpdateAvailable(true);

  const update = useCallback(() => {
    if (updateAvailable) {
      registrationRef.current.waiting.postMessage("update");
    }
  }, [updateAvailable]);

  useEffect(() => {
    register("/sw.js", {
      registered: onRegistered,
      updatefound: onUpdateFound
    });
  }, []);

  return { update, updateAvailable };
};
