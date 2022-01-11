import { makeStyles } from "@saleor/macaw-ui";

const useStyles = makeStyles(
  theme => ({
    actions: {
      flexDirection: "row-reverse",
      padding: theme.spacing(2, 3)
    },
    table: {
      tableLayout: "fixed"
    },
    infoLabel: {
      display: "inline-block"
    },
    infoLabelWithMargin: {
      marginBottom: theme.spacing()
    },
    infoRow: {
      padding: theme.spacing(2, 3)
    }
  }),
  { name: "OrderFulfilledProductsCard" }
);

export default useStyles;
