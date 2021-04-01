import { fade } from "@material-ui/core/styles/colorManipulator";
import { Overrides } from "@material-ui/core/styles/overrides";
import { IThemeColors } from "@saleor/components/Theme/themes";

const tableOverrides = (
  colors: IThemeColors,
  fontFamily: string
): Overrides => ({
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
  }
});

export default tableOverrides;
