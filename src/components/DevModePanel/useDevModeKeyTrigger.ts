import { useEffect } from "react";

type HandleOpen = () => void;

export const useDevModeKeyTrigger = (handleOpen: HandleOpen) => {
  useEffect(() => {
    const keyDownHandler = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.code === "Quote") {
        handleOpen();
      }
    };

    document.addEventListener("keydown", keyDownHandler);

    return () => {
      document.removeEventListener("keydown", keyDownHandler);
    };
  }, [handleOpen]);
};
