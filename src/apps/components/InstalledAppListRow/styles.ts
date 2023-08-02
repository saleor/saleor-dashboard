import { InstalledApp } from "@dashboard/apps/types";
import { makeStyles } from "@saleor/macaw-ui";

export const useStyles = makeStyles<InstalledApp>(
  theme => ({
    mainContent: {
      display: "flex",
      alignItems: "center",
      gap: theme.spacing(2),
    },
    logo: {
      backgroundColor: theme.palette.grey[300],
      color: theme.palette.grey[600],
      padding: theme.spacing(1.2),
      borderRadius: theme.spacing(1),
      borderWidth: 0,
    },
    name: {
      fontWeight: 600,
    },
    version: {
      color: theme.palette.saleor.main[3],
    },
    tunnel: {
      color: theme.palette.saleor.main[3],
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
        paddingLeft: theme.spacing(3),
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
  { name: "InstalledAppListRow" },
);
