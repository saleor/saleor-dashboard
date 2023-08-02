import { useTheme } from "@saleor/macaw-ui/next";

import { AvailableColumn } from "../types";

export const useEmptyColumn = (): AvailableColumn => {
  const { themeValues } = useTheme();

  return {
    id: "empty",
    title: "",
    width: 20,
    themeOverride: {
      accentColor: themeValues.colors.background.plain,
      accentLight: themeValues.colors.background.plain,
      bgHeaderHovered: themeValues.colors.background.plain,
    },
  };
};
