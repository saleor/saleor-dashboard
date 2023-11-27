import { makeStyles } from "@saleor/macaw-ui";
import { vars } from "@saleor/macaw-ui-next";

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
      color: vars.colors.text.critical1,
      "& .MuiTypography-colorTextSecondary": {
        color: vars.colors.text.critical1,
      },
    },
  }),
  { name: "WebhookSubscriptionQuery" },
);
