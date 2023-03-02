import { makeStyles } from "@saleor/macaw-ui";

export const useStyles = makeStyles(
  theme => ({
    [theme.breakpoints.up("lg")]: {
      colName: {
        paddingLeft: "0 !important",
        "&&": {
          width: "auto",
        },
      },
    },
    appName: {
      color: theme.palette.primary.main,
    },
    colAction: {
      "&&": {
        paddingRight: theme.spacing(3),
        textAlign: "right",
      },
      alignItems: "center",
      display: "flex",
      flexDirection: "row",
      justifyContent: "flex-end",
      textAlign: "right",
      gap: theme.spacing(1),
    },
    colName: {
      paddingLeft: 0,
      minWidth: theme.spacing(30),
    },
    statusWrapper: {
      display: "inline-block",
      marginLeft: theme.spacing(2.5),
    },
    tableRow: {
      cursor: "pointer",
    },
    text: {
      color: theme.palette.text.secondary,
    },
  }),
  { name: "CustomAppListPage" },
);
