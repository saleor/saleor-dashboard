import { makeStyles } from "@saleor/macaw-ui";

export const usePageStyles = makeStyles(
  theme => ({
    date: {
      marginBottom: theme.spacing(3),
    },
    header: {
      display: "flex",
      marginBottom: 0,
    },
  }),
  { name: "OrderDraftPage" },
);

export const useAlertStyles = makeStyles(
  theme => ({
    root: {
      marginBottom: theme.spacing(3),
    },
  }),
  { name: "OrderDraftAlert" },
);
