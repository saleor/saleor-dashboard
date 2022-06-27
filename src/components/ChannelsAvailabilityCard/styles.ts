import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles(
  theme => ({
    container: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
    },
    radioField: {
      paddingLeft: theme.spacing(1),
    },
    arrow: {
      transition: theme.transitions.duration.short + "ms",
    },
    card: {
      "&:last-child": {
        paddingBottom: 0,
      },
      paddingTop: 0,
    },
    channelBtn: {
      "&:focus": {
        outline: "none",
      },
      background: "transparent",
      border: "none",
      cursor: "pointer",
      textAlign: "left",
    },
    channelInfo: {
      fontSize: 14,
      padding: theme.spacing(2, 0),
    },
    channelItem: {
      "&:last-child hr": {
        display: "none",
      },
      padding: theme.spacing(2, 0),
    },
    channelName: {
      alignItems: "center",
      display: "flex",
      justifyContent: "space-between",
      marginBottom: theme.spacing(0.5),
    },
    checkbox: {
      alignItems: "flex-start",
      marginTop: 10,
    },
    date: {
      "& svg": {
        fill: theme.palette.primary.main,
      },
      marginTop: theme.spacing(1),
    },
    hr: {
      position: "relative",
    },
    label: {
      lineHeight: 1.2,
    },
    listingLabel: {
      marginTop: 9,
    },
    radioLabel: {
      "& > span": {
        padding: theme.spacing(0, 0.5),
      },
    },
    rotate: {
      transform: "rotate(180deg)",
    },
    secondLabel: {
      color: theme.palette.text.hint,
      fontSize: 12,
    },
    setPublicationDate: {
      color: theme.palette.primary.main,
      cursor: "pointer",
      fontSize: 14,
      paddingBottom: 10,
      paddingTop: 0,
    },
  }),
  { name: "ChannelsAvailabilityCard" },
);
