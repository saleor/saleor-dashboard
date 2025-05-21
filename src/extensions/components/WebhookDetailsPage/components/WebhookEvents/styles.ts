import { makeStyles } from "@saleor/macaw-ui";
import { vars } from "@saleor/macaw-ui-next";

export const useStyles = makeStyles<{ checkbox?: string }>(
  theme => ({
    eventsWrapper: {
      padding: theme.spacing(4),
      paddingLeft: 0,
    },
    objectsWrapper: {
      borderRight: "1px solid",
      borderRightColor: vars.colors.border.default1,
      padding: theme.spacing(3),
    },
    listHeader: {
      textTransform: "uppercase",
      padding: theme.spacing(1),
      minHeight: 0,
    },
    listBody: {
      height: 300,
      overflowY: "auto",
    },
    listItem: {
      minHeight: 0,
      gap: 0,
      padding: theme.spacing(1),
      cursor: "pointer",
    },
    listItemCell: {
      paddingLeft: "0 !important",
      wordBreak: "break-all",
      fontWeight: 600,
    },
    checkbox: {
      padding: 0,
      // disables shadow blinking next to the checkbox
      "& span::before": {
        display: "none",
      },
    },
    card: {
      paddingLeft: 0,
    },
    cardHeader: {
      padding: "2.4rem 3.2rem",
    },
    eventListItem: {
      padding: 0,
      gridTemplateColumns: "unset",
      minHeight: 0,
      gap: 0,
      cursor: "pointer",
    },
    eventListItemCell: {
      padding: "0 !important",
      wordBreak: "break-all",
    },
  }),
  { name: "WebhookEvents" },
);
