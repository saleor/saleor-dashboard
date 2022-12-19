import { alpha } from "@material-ui/core";
import { makeStyles } from "@saleor/macaw-ui";

export const useStyles = makeStyles(
  theme => ({
    table: {
      borderTop: `1px solid ${theme.palette.divider}`,
    },
    mainContent: {
      display: "flex",
      alignItems: "center",
      gap: theme.spacing(2),
    },
    name: {
      fontWeight: 600,
    },
    version: {
      color:
        theme.palette.type === "dark"
          ? alpha(theme.palette.saleor.generic.light, 0.8)
          : theme.palette.saleor.generic.dark,
    },
    tunnel: {
      color:
        theme.palette.type === "dark"
          ? alpha(theme.palette.saleor.generic.light, 0.8)
          : theme.palette.saleor.generic.dark,
      whiteSpace: "nowrap",
    },
    actions: {
      alignItems: "center",
      display: "flex",
      flexDirection: "row",
      justifyContent: "flex-end",
      textAlign: "right",
      gap: theme.spacing(1),
    },
    externalAppLabel: {
      cursor: "pointer",
    },
    row: {
      cursor: "pointer",
    },
    col: {
      paddingTop: theme.spacing(1),
      paddingBottom: theme.spacing(1),
    },
    colLogo: {
      width: "100%",
      "&.MuiTableCell-root:first-child:not(.MuiTableCell-paddingCheckbox)": {
        paddingLeft: 0,
        width: "100%",
      },
      height: "auto",
    },
    colActions: {
      "&&": {
        paddingRight: theme.spacing(3),
        textAlign: "right",
      },
      height: "auto",
    },
  }),
  { name: "InstalledAppList" },
);
