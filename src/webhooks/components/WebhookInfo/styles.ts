import { makeStyles } from "@saleor/macaw-ui";

export const useStyles = makeStyles(
  theme => ({
    toolbar: {
      padding: theme.spacing(2),
      backgroundColor: theme.palette.saleor.fail.mid,
      color: theme.palette.common.black,
      marginBottom: theme.spacing(2),
    },
  }),
  { name: "WebhookInfo" },
);
