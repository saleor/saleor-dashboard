import { Theme } from "@material-ui/core/styles";
import { dark, light, Themes } from "@saleor/macaw-ui";
import { themes, vars } from "@saleor/macaw-ui-next";

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
        backgroundColor: vars.colors.background.default1,
      },
    },
    MuiTypography: {
      body2: {
        fontSize: "13px",
      },
      caption: {
        fontSize: "13px",
        fontWeight: 500,
      },
    },
    MuiTextField: {
      root: {
        backgroundColor: vars.colors.background.default1,
      },
    },
    MuiInputBase: {
      root: {
        borderColor: vars.colors.border.default1,
      },
    },
    MuiOutlinedInput: {
      root: {
        backgroundColor: vars.colors.background.default1,
        borderColor: vars.colors.border.default1,
        color: vars.colors.text.default1,
        "&:hover": {
          boxShadow: "none !important",
        },
      },
    },
    MuiInputLabel: {
      root: {
        color: vars.colors.text.default1,
      },
    },
    MuiCardHeader: {
      root: {
        paddingRight: vars.spacing[8],
        backgroundColor: vars.colors.background.default1,
      },
      title: {
        fontSize: vars.fontSize[5],
        // MUI it strictly typed to be a number, but we are passing CSS variable here
        fontWeight: vars.fontWeight.medium as unknown as number,
        lineHeight: vars.lineHeight[5],
        letterSpacing: vars.letterSpacing[5],
      },
    },
    MuiCardContent: {
      root: {
        backgroundColor: vars.colors.background.default1,
      },
    },
    MuiPaper: {
      root: {
        backgroundColor: vars.colors.background.default1,
        color: vars.colors.text.default1,
      },
    },
    MuiTable: {
      root: {
        tableLayout: "auto !important" as "auto",
      },
    },
    MuiTableCell: {
      root: {
        borderBottomColor: vars.colors.border.default1,
      },
    },
    MuiIconButton: {
      edgeEnd: {
        marginRight: 0,
      },
    },
    MuiCardActions: {
      root: {
        backgroundColor: vars.colors.background.default1,
        paddingLeft: 0,
        paddingRight: 0,
      },
    },
    MuiFormHelperText: {
      root: {
        backgroundColor: vars.colors.background.default1,
      },
    },
    MuiDialogTitle: {
      root: {
        fontSize: vars.fontSize[5],
        // MUI it strictly typed to be a number, but we are passing CSS variable here
        fontWeight: vars.fontWeight.medium as unknown as number,
        lineHeight: vars.lineHeight[5],
        letterSpacing: vars.letterSpacing[5],
      },
    },
  },
};

export const paletteOverrides: Themes = {
  light: {
    ...light,
    background: {
      ...light.background,
      default: themes.defaultLight.colors.background.default1,
    },
  },
  dark: {
    ...dark,
    background: {
      ...dark.background,
      default: themes.defaultDark.colors.background.default1,
    },
  },
};
