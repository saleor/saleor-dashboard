import { makeStyles } from "@saleor/macaw-ui";

export const useStyles = makeStyles(
  theme => ({
    methodName: {
      display: "flex",
      gap: theme.spacing(1),
      alignItems: "center",
    },
  }),
  { name: "OrderTransactionCardTitle" },
);
