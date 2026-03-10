import useLocalStorage from "@dashboard/hooks/useLocalStorage";
import { type DefaultTheme, useTheme as useMacawTheme } from "@macaw-ui";

import { defaultTheme, localStorageKey } from "./consts";

export const useTheme = () => {
  const { theme, setTheme } = useMacawTheme();
  const [, setActiveTheme] = useLocalStorage<DefaultTheme>(localStorageKey, defaultTheme);

  return {
    theme,
    setTheme: (to: DefaultTheme) => {
      setActiveTheme(to);
      setTheme(to);
    },
  };
};
