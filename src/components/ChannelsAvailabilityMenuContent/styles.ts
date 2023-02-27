import { makeStyles } from "@saleor/macaw-ui";

export const useStyles = makeStyles(
  theme => ({
    menuContainer: {
      padding: theme.spacing(2),
    },

    row: {
      display: "flex",
      justifyContent: "space-between",

      "&:not(:last-child)": {
        marginBottom: theme.spacing(2),
      },
    },
    caption: {
      textTransform: "uppercase",
      color: theme.palette.saleor.main[3],
      fontWeight: 500,
      letterSpacing: "0.1em",
    },
    hr: {
      left: theme.spacing(-1),
      position: "relative",
      width: `calc(100% + ${theme.spacing(2)}px)`,
    },
    menuItem: {
      display: "block",
    },
    title: {
      padding: theme.spacing(1, 2, 1, 2),
    },
  }),
  { name: "ChannelsAvailabilityMenuContent" },
);
