import { makeStyles } from "@saleor/macaw-ui";

export const useExpanderStyles = makeStyles(
  theme => ({
    expanded: {},
    root: {
      boxShadow: "none",
      padding: theme.spacing(1, 4),

      "&:before": {
        content: "none"
      },

      "&$expanded": {
        margin: 0,
        border: "none"
      }
    }
  }),
  { name: "Expander" }
);

const useStyles = makeStyles(
  theme => ({
    container: {
      padding: theme.spacing(1, 0),
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center"
    },
    root: {
      paddingRight: theme.spacing(1)
    }
  }),
  { name: "ShippingZonesCard" }
);

export default useStyles;
