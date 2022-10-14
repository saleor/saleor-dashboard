import { Theme } from "@material-ui/core/styles";

const fontFamily = "Rubik, sans-serif";

const breakpoints = ({
  keys: ["xs", "sm", "md", "lg", "xl"],
  values: { lg: 1680, md: 1280, sm: 600, xl: 1920, xs: 0 },
} as unknown) as Theme["breakpoints"];

const themeOverrides: Partial<Theme> = {
  breakpoints,
  // @ts-ignore
  typography: {
    fontFamily,
    h1: { fontFamily },
    h2: { fontFamily },
    h3: { fontFamily },
    h4: { fontFamily },
    body1: { fontFamily },
    body2: { fontFamily },
    caption: { fontFamily },
    button: { fontFamily },
    h6: { fontFamily },
    h5: { fontFamily },
    subtitle2: { fontFamily },
  },
  overrides: {
    MuiTableCell: {
      body: {
        paddingBottom: 8,
        paddingTop: 8,
      },
      root: {
        height: 56,
        paddingBottom: 4,
        paddingTop: 4,
      },
    },
  },
};
export default themeOverrides;
