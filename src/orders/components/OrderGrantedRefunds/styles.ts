import { makeStyles } from "@material-ui/core";

const buttonWidth = 64;

export const useStyles = makeStyles(
  theme => ({
    table: {
      "&& td": {
        // gap = 24px
        paddingLeft: "12px",
        paddingRight: "12px",
        "&:first-child": {
          // Override for Material first td
          paddingRight: "12px",
        },
      },
    },
    cardTitleWrapper: {
      paddingRight: theme.spacing(2),
    },
    cardTitleContent: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    avatarContainer: {
      display: "flex",
      alignItems: "center",
      gap: theme.spacing(1),
      overflow: "hidden",
    },
    colMoney: {
      [theme.breakpoints.up("md")]: {
        width: "124px",
      },
    },
    colReason: {
      [theme.breakpoints.up("md")]: {
        width: "21%",
      },
    },
    colRequester: {
      [theme.breakpoints.up("md")]: {
        width: "23%",
      },
    },
    colAction: {
      width: `calc(${buttonWidth}px + 12px + ${theme.spacing(2)})`, // width + left padding + right padding
      "&&&": {
        paddingRight: theme.spacing(2),
      },
    },
  }),
  { name: "OrderGrantedRefunds" },
);
