import { createMuiTheme } from "@material-ui/core/styles";
import { darken, fade } from "@material-ui/core/styles/colorManipulator";
import { Overrides } from "@material-ui/core/styles/overrides";
import { createElement } from "react";

import { IThemeColors } from "../components/Theme/themes";
import CheckboxIcon from "../icons/Checkbox";
import CheckboxCheckedIcon from "../icons/CheckboxChecked";
import CheckboxIndeterminateIcon from "../icons/CheckboxIndeterminate";
import shadows from "./shadows";
import { ITheme, IThemeOptions } from "./types";

export const ICONBUTTON_SIZE = 48;

const fontFamily = '"Inter", "roboto", "sans-serif"';

const inputOverrides = (colors: IThemeColors): Overrides => ({
  MuiInput: {
    input: {
      "&:-webkit-autofill": {
        WebkitTextFillColor: colors.font.default,
        boxShadow: `inset 0 0 0px 9999px ${colors.autofill}`
      },
      "&::placeholder": {
        opacity: "1 !important" as any
      },
      color: colors.font.default
    },
    underline: {
      "&:after": {
        borderBottomColor: colors.primary
      }
    }
  },
  MuiInputBase: {
    input: {
      "&$disabled": {
        color: colors.input.disabledText
      },
      "&::placeholder": {
        color: colors.font.gray,
        opacity: "1 !important" as any
      },
      zIndex: 2
    }
  },
  MuiInputLabel: {
    filled: {
      zIndex: 2
    },
    formControl: {
      transform: "translate(0, 1.5px) scale(0.75)",
      transformOrigin: "top left" as "top left",
      width: "100%"
    },
    outlined: {
      "&$shrink": {
        transform: "translate(12px, 9px) scale(0.75)"
      },
      transform: "translate(14px, 18px) scale(1)",
      zIndex: 9
    },
    root: {
      "&$disabled": {
        color: `${fade(colors.primary, 0.4)} !important` as any
      },
      "&$error": {
        "&$focused": {
          color: colors.error
        },
        color: colors.error
      },
      "&&$focused": {
        "&:not($error)": {
          color: colors.primary
        }
      },
      color: fade(colors.input.text, 0.6)
    },
    shrink: {
      // Negates x0.75 scale
      width: "133%"
    }
  },
  MuiOutlinedInput: {
    input: {
      "&:-webkit-autofill": {
        borderRadius: 4,
        boxShadow: `0 0 0px 1000px rgba(19, 190, 187, 0.1) inset`,
        zIndex: 0
      },
      color: colors.input.text,
      padding: "23px 12px 10px 12px"
    },
    inputMultiline: {
      left: -2,
      padding: "10px 0",
      position: "relative"
    },
    root: {
      "& fieldset": {
        "&&:not($error)": {
          borderColor: colors.input.border
        },
        top: 0,
        zIndex: 1
      },
      "& legend": {
        display: "none"
      },
      "&$disabled": {
        "& fieldset": {
          borderColor: [[colors.input.disabled], "!important"] as any
        },
        "& input": {
          backgroundColor: colors.input.disabledBackground,
          color: colors.input.disabledText,
          zIndex: 2
        }
      },
      "&$error": {
        "&$focused": {
          "& fieldset": {
            borderColor: colors.error
          },
          "& input": {
            color: colors.error,
            zIndex: 2
          }
        },
        "&:hover": {
          "& fieldset": {
            borderColor: colors.error
          },
          "& input": {
            color: colors.error,
            zIndex: 2
          }
        }
      },
      "&$focused": {
        "& input": {
          "& fieldset": {
            borderColor: colors.primary
          },
          "&::placeholder": {
            opacity: [[1], "!important"] as any
          },
          color: colors.font.default
        }
      },
      "&:hover": {
        "& input": {
          color: colors.font.default
        },
        "&&&": {
          "& fieldset": {
            borderColor: colors.primary
          },
          "&$error fieldset": {
            borderColor: colors.input.error
          }
        }
      },
      backgroundColor: colors.background.paper,
      borderColor: colors.input.border,
      top: 0
    }
  }
});

const createTheme = (colors: IThemeColors): ITheme =>
  createMuiTheme({
    overrides: {
      ...inputOverrides(colors),
      MuiButton: {
        contained: {
          "&$disabled": {
            backgroundColor: fade(colors.primary, 0.12)
          },
          "&:active": {
            boxShadow: null
          },
          "&:hover": {
            boxShadow: null
          },
          boxShadow: null
        },
        containedPrimary: {
          "&:active": {
            backgroundColor: darken(colors.primary, 0.4)
          },
          "&:hover": {
            backgroundColor: darken(colors.primary, 0.1)
          }
        },
        label: {
          color: colors.font.button,
          fontWeight: 600
        },
        outlined: {
          "& span": {
            color: colors.primary
          }
        },
        root: {
          "& svg": {
            marginLeft: 8
          },
          borderRadius: 4
        },
        text: {
          "& span": {
            color: colors.font.default
          }
        },
        textPrimary: {
          "& span": {
            color: colors.primary
          }
        }
      },
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
          height: 32,
          left: -5,
          position: "relative",
          width: 32
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
      MuiIconButton: {
        root: {
          "&:hover": {
            backgroundColor: fade(colors.primary, 0.12)
          }
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
      MuiSwitch: {
        colorPrimary: {
          "&$checked": {
            color: colors.background.paper
          }
        },
        root: {
          "&$disabled": {
            "&$switchBase": {
              "& + $thumb": {
                backgroundColor: colors.gray.disabled
              }
            }
          },
          height: 48,
          width: 72
        },
        switchBase: {
          "&$checked": {
            transform: "translateX(23px)"
          },
          boxShadow: "none",
          left: 1,
          marginLeft: 4,
          top: 5
        },
        thumb: {
          boxShadow: "none"
        },
        track: {
          "$colorPrimary$checked + &": {
            backgroundColor: colors.primary
          },
          backgroundColor: colors.gray.default,
          borderRadius: 12,
          height: 24,
          opacity: [["1"], "!important"] as any,
          width: 48
        }
      },
      MuiTable: {
        root: {
          fontFamily,
          fontFeatureSettings: '"tnum"'
        }
      },
      MuiTableCell: {
        body: {
          fontSize: "1rem",
          paddingBottom: 8,
          paddingTop: 8
        },
        head: {
          fontSize: "1rem"
        },
        paddingCheckbox: {
          "&:first-child": {
            padding: "0 12px",
            width: 72
          },
          "&:not(first-child)": {
            padding: 0,
            width: 52
          }
        },
        root: {
          "&:first-child": {
            "&:not($paddingCheckbox)": {
              paddingLeft: 24 + "px",
              textAlign: "left" as "left"
            }
          },
          borderBottomColor: colors.paperBorder,
          height: 56,
          padding: "4px 24px"
        }
      },
      MuiTableRow: {
        footer: {
          "$root$hover&:hover": {
            background: "none"
          }
        },
        head: {
          "$root$hover&:hover": {
            background: "none"
          }
        },
        hover: {
          "$root&:hover": {
            backgroundColor: fade(colors.primary, 0.3)
          }
        },
        root: {
          "&$selected": {
            backgroundColor: fade(colors.primary, 0.05)
          }
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
    palette: {
      action: {
        active: colors.checkbox.default
      },
      background: colors.background,
      divider: colors.divider,
      error: {
        main: colors.error
      },
      primary: {
        contrastText: "#ffffff",
        dark: colors.font.textDisabled,
        main: colors.primary
      },
      secondary: {
        contrastText: "#ffffff",
        main: colors.secondary
      },
      text: {
        disabled: colors.font.gray,
        hint: colors.font.gray,
        primary: colors.font.default,
        secondary: colors.font.gray
      },
      textHighlighted: {
        active: colors.primary,
        inactive: colors.highlightInactive.default
      },
      type: colors.theme
    },
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
      },
      MuiCheckbox: {
        checkedIcon: createElement(CheckboxCheckedIcon),
        color: "primary",
        icon: createElement(CheckboxIcon),
        indeterminateIcon: createElement(CheckboxIndeterminateIcon)
      }
    },
    shadows,
    typography: {
      allVariants: {
        fontFamily
      },
      body1: {
        color: colors.font.default
      },
      fontFamily,
      h4: {
        color: colors.font.default
      },
      h5: {
        fontSize: "1.3125rem"
      }
    }
  } as IThemeOptions);

export default createTheme;
