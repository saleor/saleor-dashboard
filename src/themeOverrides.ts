import { Theme } from "@material-ui/core/styles";

const breakpoints = ({
  keys: ["xs", "sm", "md", "lg", "xl"],
  values: { lg: 1680, md: 1280, sm: 600, xl: 1920, xs: 0 },
} as unknown) as Theme["breakpoints"];

const themeOverrides: Partial<Theme> = {
  breakpoints,
};

export default themeOverrides;
