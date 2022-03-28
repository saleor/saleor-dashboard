import { useEffect, useRef } from "react";

const useBeforeUnload = fn => {
  const cb = useRef(fn);

  useEffect(() => {
    cb.current = fn;
  }, [fn]);

  useEffect(() => {
    const onBeforeUnload = (...args) => cb.current?.(...args);

    window.addEventListener("beforeunload", onBeforeUnload);

    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, []);
};

export default useBeforeUnload;
