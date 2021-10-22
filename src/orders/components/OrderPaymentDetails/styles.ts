import { makeStyles } from "@saleor/macaw-ui";

export const useStyles = makeStyles(
  theme => ({
    root: {
      ...theme.typography.body1,
      lineHeight: 1.9,
      width: "100%"
    },
    cardContent: {
      paddingTop: 0,
      paddingBottom: 0
    },
    textRight: {
      textAlign: "right"
    },
    status: {
      display: "flex",
      flexDirection: "row-reverse"
    },
    actions: {
      "&:last-child": {
        marginRight: theme.spacing(-1)
      }
    },
    reference: {
      color: theme.palette.text.disabled,
      fontSize: 14
    }
  }),
  { name: "OrderPaymentDetails" }
);
