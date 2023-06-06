import { Theme } from "@material-ui/core/styles";
import { dark, light, Themes } from "@saleor/macaw-ui";
import { themes, vars } from "@saleor/macaw-ui/next";

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
        backgroundColor: vars.colors.background.surfaceNeutralPlain,
      },
    },
    MuiInputBase: {
      root: {
        borderColor: vars.colors.border.neutralPlain,
      },
    },
    MuiOutlinedInput: {
      root: {
        backgroundColor: vars.colors.background.surfaceNeutralPlain,
        borderColor: vars.colors.border.neutralPlain,
        color: vars.colors.foreground.textNeutralDefault,
        "&:hover": {
          boxShadow: "none !important",
        },
      },
    },
    MuiInputLabel: {
      root: {
        color: vars.colors.foreground.textNeutralDefault,
      },
    },
    MuiCardHeader: {
      root: {
        paddingRight: vars.spacing[8],
        backgroundColor: vars.colors.background.surfaceNeutralPlain,
      },
      title: {
        fontSize: vars.fontSize.bodyEmpLarge,
        // MUI it strictly typed to be a number, but we are passing CSS variable here
        fontWeight: vars.fontWeight.bodyEmpLarge as unknown as number,
        lineHeight: vars.lineHeight.bodyEmpLarge,
        letterSpacing: vars.letterSpacing.bodyEmpLarge,
      },
    },
    MuiCardContent: {
      root: {
        backgroundColor: vars.colors.background.plain,
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
    MuiTableCell: {
      root: {
        borderBottomColor: vars.colors.border.neutralPlain,
      },
    },
    MuiIconButton: {
      edgeEnd: {
        marginRight: 0,
      },
    },
    MuiCardActions: {
      root: {
        backgroundColor: vars.colors.background.plain,
        paddingLeft: 0,
        paddingRight: 0,
      },
    },
    MuiFormHelperText: {
      root: {
        backgroundColor: vars.colors.background.plain,
      },
    },
    MuiDialogTitle: {
      root: {
        fontSize: vars.fontSize.bodyEmpLarge,
        // MUI it strictly typed to be a number, but we are passing CSS variable here
        fontWeight: vars.fontWeight.bodyEmpLarge as unknown as number,
        lineHeight: vars.lineHeight.bodyEmpLarge,
        letterSpacing: vars.letterSpacing.bodyEmpLarge,
      },
    },
  },
};

export const paletteOverrides: Themes = {
  light: {
    ...light,
    background: {
      ...light.background,
      default: themes.defaultLight.colors.background.plain,
    },
  },
  dark: {
    ...dark,
    background: {
      ...dark.background,
      default: themes.defaultDark.colors.background.plain,
    },
  },
};
