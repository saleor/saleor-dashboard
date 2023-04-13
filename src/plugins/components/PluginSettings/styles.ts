import { makeStyles } from "@saleor/macaw-ui";

export const useStyles = makeStyles(
  theme => ({
    authItem: {
      display: "flex",
    },
    button: {
      marginRight: theme.spacing(),
    },
    item: {
      "&:not(:last-child)": {
        marginBottom: theme.spacing(3),
      },
      alignItems: "center",
      display: "flex",
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
