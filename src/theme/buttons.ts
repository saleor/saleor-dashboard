import { darken, fade } from "@material-ui/core/styles/colorManipulator";
import { Overrides } from "@material-ui/core/styles/overrides";
import { IThemeColors } from "@saleor/components/Theme/themes";

const buttonOverrides = (colors: IThemeColors): Overrides => ({
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
      "&:not($disabled) span": {
        color: colors.primary
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
  }
});

export default buttonOverrides;
