import { makeStyles } from "@saleor/macaw-ui";

export const useStyles = makeStyles(
  theme => ({
    [theme.breakpoints.up("lg")]: {
      colAction: {
        "& svg": {
          color: theme.palette.primary.main,
        },
        textAlign: "right" as "right",
      },
      colName: {
        "&&": {
          width: "auto",
        },
      },
    },
    colName: {
      paddingLeft: 0,
      width: 250,
    },
    colNameUnnamed: {
      color: theme.palette.text.secondary,
    },
    colRight: {
      textAlign: "right",
    },
    table: {
      tableLayout: "fixed",
    },
    tableRow: {
      cursor: "pointer",
    },
    cardTitle: {
      paddingLeft: 0,
      paddingRight: 8,
    },
    card: {
      paddingLeft: 30,
      paddingRight: 16,
    },
  }),
  { name: "WebhooksList" },
);
