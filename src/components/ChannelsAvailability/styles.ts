import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles(
  theme => ({
    arrow: {
      transition: theme.transitions.duration.short + "ms"
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
    channelName: {
      alignItems: "center",
      display: "flex",
      justifyContent: "space-between",
      marginBottom: theme.spacing(0.5)
    },
    date: {
      "& svg": {
        fill: theme.palette.primary.main
      },
      marginTop: theme.spacing(3)
    },
    label: {
      lineHeight: 1,
      margin: 0
    },
    rotate: {
      transform: "rotate(180deg)"
    },
    secondLabel: {
      fontSize: 12
    },
    setPublicationDate: {
      color: theme.palette.primary.main,
      cursor: "pointer",
      fontSize: "14px",
      paddingTop: "15px",
      textDecoration: "underline"
    }
  }),
  { name: "AvailabilityCard" }
);
