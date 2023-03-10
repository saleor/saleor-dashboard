import { useTheme } from "@saleor/macaw-ui/next";

export const useEmptyColumn = () => {
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
