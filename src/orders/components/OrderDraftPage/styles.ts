import { makeStyles } from "@saleor/macaw-ui";

export const useAlertStyles = makeStyles(
  theme => ({
    root: {
      marginBottom: theme.spacing(3),
    },
  }),
  { name: "OrderDraftAlert" },
);
