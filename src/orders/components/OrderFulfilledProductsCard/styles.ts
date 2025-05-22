import { makeStyles } from "@saleor/macaw-ui";

const useStyles = makeStyles(
  theme => ({
    actions: {
      flexDirection: "row-reverse",
      padding: theme.spacing(2, 0),
    },
    table: {
      "& td, & th": {
        "&:not(:first-child):not(:last-child)": {
          paddingLeft: theme.spacing(1),
          paddingRight: theme.spacing(1),
        },
      },
      tableLayout: "fixed",
    },
    infoLabel: {
      display: "inline-block",
    },
    infoLabelWithMargin: {
      marginBottom: theme.spacing(),
    },
  }),
  { name: "OrderFulfilledProductsCard" },
);

export default useStyles;
