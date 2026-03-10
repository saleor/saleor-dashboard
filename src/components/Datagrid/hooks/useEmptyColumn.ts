import { useTheme } from "@macaw-ui";

import { type AvailableColumn } from "../types";

export const useEmptyColumn = (): AvailableColumn => {
  const { themeValues } = useTheme();

  return {
    id: "empty",
    title: "",
    width: 20,
    themeOverride: {
      accentColor: themeValues.colors.background.default1,
      accentLight: themeValues.colors.background.default1,
      bgHeaderHovered: themeValues.colors.background.default1,
    },
  };
};
