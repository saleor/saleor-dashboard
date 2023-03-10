import { themes, useTheme } from "@saleor/macaw-ui/next";

export const useEmptyColumn = () => {
  const { theme: currentTheme } = useTheme();
  const theme = themes[currentTheme];

  return {
    id: "empty",
    title: "",
    width: 20,
    themeOverride: {
      accentColor: theme.colors.background.plain,
      accentLight: theme.colors.background.plain,
      bgHeaderHovered: theme.colors.background.plain,
    },
  };
};
