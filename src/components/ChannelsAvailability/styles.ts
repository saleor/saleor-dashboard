import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles(
  theme => ({
    children: {
      "& button": {
        margin: "0 9px"
      },
      "& label": {
        marginTop: theme.spacing(2.5)
      }
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
