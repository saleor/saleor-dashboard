import { makeStyles } from "@saleor/macaw-ui";

export const useStyles = makeStyles(
  theme => ({
    content: {
      "& hr": {
        left: -24,
        position: "relative",
        width: "calc(100% + 48px)",
      },
    },
    contentTitle: {
      margin: theme.spacing(1, 0),
    },
    dialog: {
      marginBottom: -30,
      marginTop: theme.spacing(2),
    },
    input: {
      "& label": {
        overflowX: "inherit",
      },
    },
    label: {
      fontSize: 14,
    },
    notFound: {
      paddingBottom: theme.spacing(2),
    },
    option: {
      "&:last-child": {
        "& hr": {
          display: "none",
        },
      },
      margin: theme.spacing(1, 0),
    },
    scrollArea: {
      maxHeight: 400,
      overflowY: "scroll",
    },
    text: {
      marginBottom: 5,
    },
  }),
  { name: "ChannelsAvailabilityContent" },
);
