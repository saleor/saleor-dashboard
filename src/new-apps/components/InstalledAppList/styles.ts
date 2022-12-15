import { alpha } from "@material-ui/core";
import { makeStyles } from "@saleor/macaw-ui";

export const useStyles = makeStyles(
  theme => ({
    table: {
      borderTop: `1px solid ${theme.palette.divider}`,
    },
    logo: {
      display: "flex",
      width: "100%",
      "&.MuiTableCell-root:first-child:not(.MuiTableCell-paddingCheckbox)": {
        paddingLeft: 0,
      },
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
  }),
  { name: "InstalledAppList" },
);
