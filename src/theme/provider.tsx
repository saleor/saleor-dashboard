import useLocalStorage from "@dashboard/hooks/useLocalStorage";
import {
  type DefaultTheme,
  ThemeProvider as MacawThemeProvider,
  useTheme,
} from "@saleor/macaw-ui-next";
import { type ReactNode, useEffect } from "react";

import { defaultTheme, localStorageKey } from "./consts";
import { secondaryTextCssVar, secondaryTextDefault2 } from "./secondaryTextContrast";

/**
 * Nudges secondary text contrast dashboard-wide.
 *
 * Macaw's ThemeProvider writes all theme CSS vars in a parent `useEffect`.
 * Child effects run first, so a synchronous write here would be overwritten.
 * Queue a microtask so our value sticks after Macaw's apply.
 */
const SecondaryTextContrastOverride = (): null => {
  const { theme } = useTheme();

  useEffect(
    function applySecondaryTextContrast() {
      let cancelled = false;

      queueMicrotask(() => {
        if (cancelled) {
          return;
        }

        document.documentElement.style.setProperty(
          secondaryTextCssVar,
          secondaryTextDefault2[theme],
        );
      });

      return (): void => {
        cancelled = true;
      };
    },
    [theme],
  );

  return null;
};

export const ThemeProvider = ({ children }: { children: ReactNode }): JSX.Element => {
  const [activeTheme] = useLocalStorage<DefaultTheme>(localStorageKey, defaultTheme);

  return (
    <MacawThemeProvider defaultTheme={activeTheme}>
      <SecondaryTextContrastOverride />
      {children}
    </MacawThemeProvider>
  );
};
