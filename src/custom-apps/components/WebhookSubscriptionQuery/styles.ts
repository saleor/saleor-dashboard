import { makeStyles } from "@saleor/macaw-ui";

export const useStyles = makeStyles(
  theme => ({
    disabled: {
      pointerEvents: "none",
      opacity: 0.6,
    },
    cardContent: {
      height: 500,
      padding: 0,
    },
    card: {
      marginBottom: theme.spacing(2),
    },
    cardTitle: {
      paddingLeft: 0,
    },
  }),
  { name: "WebhookSubscriptionQuery" },
);
