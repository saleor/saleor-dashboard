import { createMuiTheme } from "@material-ui/core/styles";
import { fade } from "@material-ui/core/styles/colorManipulator";
import { TypographyProps } from "@material-ui/core/Typography";
import { createElement } from "react";

import { IThemeColors } from "../components/Theme/themes";
import CheckboxIcon from "../icons/Checkbox";
import CheckboxCheckedIcon from "../icons/CheckboxChecked";
import CheckboxIndeterminateIcon from "../icons/CheckboxIndeterminate";
import buttonOverrides from "./buttons";
import inputOverrides from "./inputs";
import createPalette from "./palette";
import shadows from "./shadows";
import tableOverrides from "./tables";
import { SaleorTheme } from "./types";

export const ICONBUTTON_SIZE = 48;

const fontFamily = '"Inter", "roboto", "sans-serif"';

const createTheme = (colors: IThemeColors): SaleorTheme =>
  (createMuiTheme({
    overrides: {
      ...inputOverrides(colors),
      ...tableOverrides(colors, fontFamily),
      ...buttonOverrides(colors),
      MuiCard: {
        root: {
          borderColor: colors.paperBorder,
          borderRadius: 8,
          borderStyle: "solid",
          borderWidth: 1,
          overflow: "visible"
        }
      },
      MuiCardActions: {
        root: {
          flexDirection: "row-reverse" as "row-reverse"
        }
      },
      MuiCardContent: {
        root: {
          padding: "24px"
        }
      },
      MuiChip: {
        avatar: {
          fontSize: "1.2rem",
          height: 32,
          left: -5,
          position: "relative",
          width: 32
        },
        root: {
          "& $avatar": {
            fontSize: "1.2rem"
          },
          fontSize: "1.3rem"
        }
      },
      MuiDialogActions: {
        root: {
          borderTop: `1px solid ${colors.divider}`,
          padding: `16px 24px`
        }
      },
      MuiDialogContent: {
        root: {
          "& label": {
            overflowX: "hidden"
          },
          padding: 24
        }
      },
      MuiDialogContentText: {
        root: {
          "&:last-child": {
            marginBottom: 0
          }
        }
      },
      MuiDialogTitle: {
        root: {
          borderBottom: `1px solid ${colors.divider}`
        }
      },
      MuiFormControlLabel: {
        label: {
          lineHeight: 1.2,
          marginLeft: 4
        }
      },
      MuiFormLabel: {
        filled: {
          "&&:not($error)": {
            color: colors.primary
          }
        },
        root: {
          "&&$focused:not($error)": {
            color: colors.font.gray
          }
        }
      },
      MuiSvgIcon: {
        root: {
          fontSize: "2.4rem",
          height: "1em",
          width: "1em"
        }
      },
      MuiList: {
        root: {
          display: "grid",
          gridRowGap: 8 + "px",
          padding: "8px !important"
        }
      },
      MuiListItem: {
        button: {
          "&:focus": {
            backgroundColor: colors.input.default
          }
        },
        root: {
          "&$selected": {
            "&:hover": {
              backgroundColor: colors.input.default
            },
            backgroundColor: colors.input.default
          }
        }
      },
      MuiMenu: {
        paper: {
          borderRadius: 8
        }
      },
      MuiMenuItem: {
        root: {
          "&$selected, &$selected:focus, &$selected:hover": {
            backgroundColor: [colors.background.default, "!important"] as any,
            color: colors.primary,
            fontWeight: 700
          },
          "&:hover": {
            backgroundColor: [colors.background.default, "!important"] as any,
            color: colors.font.default,
            fontWeight: 400
          },
          borderRadius: 4
        }
      },
      MuiSelect: {
        root: {
          "&$disabled": {
            backgroundColor: colors.input.disabledBackground
          }
        }
      },
      MuiSnackbarContent: {
        action: {
          "& $MuiIconButton": {
            "& svg": {
              color: colors.font.default
            }
          },
          display: "block",
          paddingBottom: 10,
          paddingLeft: 0,
          paddingRight: 45
        },
        message: {
          fontSize: 16
        },
        root: {
          backgroundColor: colors.background.paper,
          boxShadow:
            "0 6px 10px 0px rgba(0, 0, 0, 0.15), 0 1px 18px 0px rgba(0, 0, 0, 0.12), 0 3px 5px -1px rgba(0, 0, 0, 0.10)",
          color: colors.font.default,
          display: "block",
          maxWidth: 480
        }
      },
      MuiTouchRipple: {
        child: {
          backgroundColor: fade(colors.primary, 0.2)
        },
        childLeaving: {
          backgroundColor: fade(colors.primary, 0.2)
        },
        ripple: {
          "&$rippleVisible": {
            backgroundColor: fade(colors.primary, 0.2)
          },
          borderRadius: "100%"
        }
      }
    },
    palette: createPalette(colors),
    props: {
      MuiFormControl: {
        variant: "filled"
      },
      MuiTextField: {
        variant: "outlined"
      },
      MuiCard: {
        elevation: 0
      },
      MuiTypography: {
        component: "div"
      } as TypographyProps,
      MuiCheckbox: {
        checkedIcon: createElement(CheckboxCheckedIcon),
        color: "primary",
        icon: createElement(CheckboxIcon),
        indeterminateIcon: createElement(CheckboxIndeterminateIcon)
      }
    },
    shadows,
    spacing: (value: number = 1) => `${(value * 8) / 10}rem`,
    typography: {
      allVariants: {
        fontFamily
      },
      body1: {
        color: colors.font.default,
        fontSize: "1.6rem"
      },
      body2: {
        fontSize: "1.4rem"
      },
      button: {
        fontSize: "1.4rem"
      },
      caption: {
        fontSize: "1.2rem"
      },
      fontFamily,
      h4: {
        fontSize: "3.4rem",
        color: colors.font.default
      },
      h5: {
        fontSize: "2.1rem",
        fontWeight: 500
      },
      h6: {
        fontSize: "2rem",
        fontWeight: 500
      },
      subtitle2: {
        fontSize: "1.4rem"
      }
    }
  }) as unknown) as SaleorTheme;

export default createTheme;
