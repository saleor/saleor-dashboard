import { Theme } from "@material-ui/core/styles";
import { dark, light, Themes } from "@saleor/macaw-ui";
import { vars } from "@saleor/macaw-ui/next";

const breakpoints = {
  keys: ["xs", "sm", "md", "lg", "xl"],
  values: { lg: 1680, md: 1280, sm: 600, xl: 1920, xs: 0 },
} as unknown as Theme["breakpoints"];

export const themeOverrides: Partial<Theme> = {
  breakpoints,
  overrides: {
    MuiCard: {
      root: {
        border: 0,
        backgroundColor: vars.colors.background.surfaceNeutralPlain,
      },
    },
    MuiTypography: {
      root: {
        color: vars.colors.foreground.textNeutralDefault,
        margin: "unset",
      },
    },
    MuiPaper: {
      root: {
        backgroundColor: vars.colors.background.plain,
        color: vars.colors.foreground.textNeutralDefault,
      },
    },
    MuiTable: {
      root: {
        tableLayout: "auto !important" as "auto",
      },
    },
    MuiIconButton: {
      edgeEnd: {
        marginRight: 0,
      },
    },
    MuiCardActions: {
      root: {
        paddingLeft: 0,
        paddingRight: 0,
      },
    },
  },
};

export const paletteOverrides: Themes = {
  light: {
    ...light,
    background: {
      ...light.background,
      default: vars.colors.background.plain,
    },
  },
  dark: {
    ...dark,
    background: {
      ...dark.background,
      default: vars.colors.background.plain,
    },
  },
};
