import { useEffect, useRef, useState } from "react";

export function useClipboard(): [boolean, (text: string) => void] {
  const [copied, setCopyStatus] = useState(false);
  const timeout = useRef<null | number>(null);
  const clear = () => {
    if (timeout.current) {
      clearTimeout(timeout.current);
      timeout.current = null;
    }
  };
  const copy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopyStatus(true);

      timeout.current = window.setTimeout(() => {
        clear();
        setCopyStatus(false);
      }, 2000);
    });
  };

  // Clear timeout after hook unmounting
  useEffect(() => clear, []);

  return [copied, copy];
}
