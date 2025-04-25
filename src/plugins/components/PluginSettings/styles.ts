import { makeStyles } from "@saleor/macaw-ui";

export const useStyles = makeStyles(
  theme => ({
    authItem: {
      display: "flex",
    },
    button: {
      marginRight: theme.spacing(),
    },
    itemLabel: {
      fontWeight: 500,
    },
    spacer: {
      flex: 1,
    },
  }),
  { name: "PluginSettings" },
);
