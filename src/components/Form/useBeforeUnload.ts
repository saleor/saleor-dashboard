import { useEffect, useRef } from "react";

const useBeforeUnload = (fn: (event: BeforeUnloadEvent) => void) => {
  const cb = useRef(fn);

  useEffect(() => {
    cb.current = fn;
  }, [fn]);
  useEffect(() => {
    const onBeforeUnload = (event: BeforeUnloadEvent) => cb.current?.(event);

    window.addEventListener("beforeunload", onBeforeUnload);

    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, []);
};

export default useBeforeUnload;
