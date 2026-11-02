import { makeStyles } from "@saleor/macaw-ui";

export const useStyles = makeStyles(
  theme => ({
    warningIcon: {
      color: theme.palette.saleor.warning.mid,
      marginRight: theme.spacing(2),
    },
  }),
  { name: "OrderFulfillLine" },
);
