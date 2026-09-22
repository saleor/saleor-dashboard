import { useHotkeys } from "react-hotkeys-hook";

export const usePressEscKey = (callback?: () => void) => {
  useHotkeys("escape", () => callback?.(), {
    enableOnFormTags: true,
    enableOnContentEditable: true,
  });
};
