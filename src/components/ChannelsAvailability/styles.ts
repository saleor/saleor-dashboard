import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles(
  theme => ({
    arrow: {
      transition: theme.transitions.duration.short + "ms"
    },
    card: {
      "&:last-child": {
        paddingBottom: 0
      },
      paddingTop: 0
    },
    channelBtn: {
      "&:focus": {
        outline: "none"
      },
      background: "transparent",
      border: "none",
      cursor: "pointer",
      textAlign: "left"
    },
    channelInfo: {
      fontSize: 14,
      padding: theme.spacing(2, 0)
    },
    channelItem: {
      "&:last-child hr": {
        display: "none"
      },
      padding: theme.spacing(2, 0)
    },
    channelName: {
      alignItems: "center",
      display: "flex",
      justifyContent: "space-between",
      marginBottom: theme.spacing(0.5)
    },
    checkbox: {
      alignItems: "flex-start",
      marginTop: 10
    },
    date: {
      "& svg": {
        fill: theme.palette.primary.main
      },
      marginTop: theme.spacing(1)
    },
    hr: {
      left: theme.spacing(-3),
      position: "relative",
      width: `calc(100% + ${theme.spacing(6)}px)`
    },
    label: {
      lineHeight: 1.2,
      marginBottom: 5,
      marginTop: 0
    },
    listingLabel: {
      marginTop: 9
    },
    rotate: {
      transform: "rotate(180deg)"
    },
    secondLabel: {
      color: theme.palette.text.hint,
      fontSize: 12
    },
    setPublicationDate: {
      color: theme.palette.primary.main,
      cursor: "pointer",
      fontSize: 14,
      paddingBottom: 10,
      paddingTop: 0
    }
  }),
  { name: "ChannelsAvailabilityCard" }
);
