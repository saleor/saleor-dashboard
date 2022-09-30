import { Theme } from "@material-ui/core/styles";

const fontFamily = "Source Sans Pro, sans-serif";
const themeOverrides: Partial<Theme> = {
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
