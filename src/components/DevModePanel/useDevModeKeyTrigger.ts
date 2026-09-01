import { useHotkeys } from "react-hotkeys-hook";

type HandleOpen = () => void;

export const useDevModeKeyTrigger = (handleOpen: HandleOpen) => {
  useHotkeys("mod+quote", handleOpen, {
    enableOnFormTags: true,
    enableOnContentEditable: true,
  });
};
