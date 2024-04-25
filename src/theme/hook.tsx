import useLocalStorage from "@dashboard/hooks/useLocalStorage";
import { DefaultTheme, useTheme as useMacawTheme } from "@saleor/macaw-ui-next";

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
