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
    error: {
      color: theme.palette.error.main,
      "& .MuiTypography-colorTextSecondary": {
        color: theme.palette.error.main,
      }
    }
  }),
  { name: "WebhookSubscriptionQuery" },
);
