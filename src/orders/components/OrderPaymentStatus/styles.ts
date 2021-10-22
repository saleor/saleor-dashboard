import { makeStyles } from "@saleor/macaw-ui";

export const useStyles = makeStyles(
  theme => ({
    popover: {
      pointerEvents: "none"
    },
    paper: {
      padding: theme.spacing(2)
    },
    paymentStatusList: {
      maxWidth: 400
    },
    tableCellHeader: {
      height: 0,
      borderBottom: "none"
    },
    tableCell: {
      height: 0,
      borderBottom: "none"
    },
    statusCell: {
      display: "flex",
      flexDirection: "row-reverse"
    }
  }),
  { name: "OrderPaymentStatus" }
);
