import { ShortcutsItems } from "../ShotcutsItems";
import { useShortcuts } from "./useShortcuts";

export const Shortcusts = () => {
  const shortcuts = useShortcuts();

  // ShortcutsItems is memoized, to prevent rerender when context change
  return <ShortcutsItems items={shortcuts} />;
};
