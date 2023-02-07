import { makeStyles } from "@saleor/macaw-ui";

export const useStyles = makeStyles(
  theme => ({
    eventsWrapper: {
      overflow: "scroll",
      padding: theme.spacing(4),
      paddingLeft: 0,
    },
    objectsWrapper: {
      borderRight: "1px solid",
      borderRightColor: theme.palette.divider,
      padding: theme.spacing(3),
    },
    listHeader: {
      textTransform: "uppercase",
      padding: theme.spacing(1),
      minHeight: 0,
    },
    listItem: {
      minHeight: 0,
      gap: 0,
      padding: theme.spacing(1),
    },
    listItemCell: {
      paddingLeft: "0 !important",
    },
    listItems: {
      height: 300,
      overflow: "scroll",
    },
    checkbox: {
      padding: 0,
    },
    card: {
      paddingLeft: 0,
    },
  }),
  { name: "WebhookEvents" },
);
