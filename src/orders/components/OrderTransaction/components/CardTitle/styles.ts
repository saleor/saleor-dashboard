import { makeStyles } from "@saleor/macaw-ui";
import { vars } from "@saleor/macaw-ui-next";

export const useStyles = makeStyles(
  theme => ({
    title: {
      width: "100%",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    methodName: {
      display: "flex",
      gap: theme.spacing(1),
      alignItems: "center",
    },
    dataDisplay: {
      display: "flex",
      gap: vars.spacing[7],
      alignItems: "center",
    },
  }),
  { name: "OrderTransactionCardTitle" },
);
