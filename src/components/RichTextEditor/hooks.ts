import { useLayoutEffect, useState } from "react";

export const useHasRendered = () => {
  const [hasRendered, setHasRendereed] = useState(false);

  useLayoutEffect(() => {
    setHasRendereed(true);
  }, []);

  return hasRendered;
};
