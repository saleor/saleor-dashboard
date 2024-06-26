import { useEffect } from "react";

type HandleOpen = () => void;
type HandleClose = () => void;

export const useDevModeKeyTrigger = (
  handleOpen: HandleOpen,
  handleClose: HandleClose,
) => {
  useEffect(() => {
    const keyDownHandler = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.code === "Quote") {
        handleOpen();
      }
    };

    const keyUpHandler = (event: KeyboardEvent) => {
      if (event.code === "Escape") {
        handleClose();
      }
    };

    document.addEventListener("keydown", keyDownHandler);
    // GraphiQL Playground stops propagation of keydown event for Escape key
    document.addEventListener("keyup", keyUpHandler);

    return () => {
      document.removeEventListener("keydown", keyDownHandler);
      document.removeEventListener("keyup", keyUpHandler);
    };
  }, [handleOpen, handleClose]);
};
