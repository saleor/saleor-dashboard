import { makeStyles } from "@saleor/macaw-ui";

export const useStyles = makeStyles(
  theme => ({
    refundsButtons: {
      display: "flex",
      gap: theme.spacing(1),
    },
    list: {
      listStyle: "none",
      margin: 0,
      padding: 0,
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: theme.spacing(2),

      "& dl": {
        margin: 0,
      },

      "& dd": {
        margin: 0,
      },
    },
    explainText: {
      color: theme.palette.saleor.main[3],
    },
    paymentStatus: {
      alignSelf: "flex-end",
    },
  }),
  { name: "styles" },
);
