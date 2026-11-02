import { makeStyles } from "@saleor/macaw-ui";

export const useStyles = makeStyles(
  theme => ({
    table: {
      "&&": {
        tableLayout: "fixed",
      },
    },
    shipmentInformationCard: {
      padding: theme.spacing(3),
      alignSelf: "start",
      display: "grid",
      gridRowGap: theme.spacing(1),
    },
    supportHeader: {
      textTransform: "uppercase",
      color: theme.palette.saleor.main[3],
      fontWeight: 500,
      letterSpacing: "0.1em",
      fontSize: "12px",
      lineHeight: "160%",
      marginBottom: theme.spacing(2),
    },
  }),
  { name: "OrderFulfillPage" },
);
